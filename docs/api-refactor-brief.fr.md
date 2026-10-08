# Brief d’implémentation — simplification de create-element

## Objectif et périmètre

Refondre la bibliothèque en bêta pour réduire la duplication et unifier les contrats DOM, JSX et SSR. Les breaking changes sont autorisés. Implémenter la refonte et conserver le SSR. Préparer les points d’extension nécessaires à l’hydratation, sans implémenter `hydrate`, sans prototype d’hydratation et sans publier de fonction factice.

Ce document consolide les décisions de la discussion. Les règles indiquées comme « proposées » sont des recommandations à distinguer des choix explicitement validés.

## Décisions retenues

- `h()` et JSX produisent une description d’arbre différée commune au navigateur et au serveur. La construction de cette description ne crée ni DOM ni abonnement. `h()` accepte uniquement les noms de balises ; les fonctions sont appelées directement. Les composants JSX sont exécutés pendant le rendu.
- Une seule implémentation source pour JSX et les renderers, spécialisée par moteur réactif au build, suivant l’approche Formisch : https://formisch.dev/blog/one-core-six-frameworks/.
- Les utilisateurs peuvent passer directement leurs signaux natifs dans les props et les enfants. Le `jsxImportSource` sélectionne les types JSX de l’intégration correspondante.
- Conserver les cinq intégrations actuelles, ainsi que HTML, SVG et MathML.
- Conserver les propriétés spéciales `class`, `style` et `data`, leurs formats pratiques et leurs valeurs réactives.
- Pouvoir créer un véritable élément DOM détaché avec `build`, puis nettoyer ses ressources avec `dispose(element)`.
- Permettre `build(h('button')) // HTMLButtonElement`
- Permettre `build<'button'>(<button />)` pour préciser le type DOM retourné. Adapter le plugin Oxlint existant pour vérifier cette correspondance directement sur `build`, sans helper `asDom`.
- Ne pas permettre `build` avec un Fragment
- Implémenter `ref` sous forme de callback typé selon le tag, avec retour optionnel d’une fonction de nettoyage. Son contrat est détaillé plus bas.
- Pouvoir appliquer des props à un élément existant avec `bind`.
- Une seule liaison active par élément, installée par `build`, `mount` ou `bind`. Un symbole partagé entre intégrations identifie cette liaison ; `bind` refuse un élément déjà géré avant toute mutation, jusqu’au nettoyage de sa liaison ou à `dispose(element)`.
- La présence de `children` ou `innerHTML` dans `bind` remplace intégralement l’ancien sous-arbre enfant.
- Accepter des nœuds DOM existants comme enfants opaques côté navigateur, en conservant leur identité. Leur insertion déplace l’instance ; aucun clone implicite.
- Le SSR refuse explicitement les nœuds DOM réels rencontrés dans l’arbre.

## API publique cible

| Opération              | Contrat                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `h(type, props)` / JSX | Décrire un arbre ; ne pas créer de DOM                                                                        |
| `build(tree)`          | Créer un élément DOM détaché et installer son comportement réactif                                            |
| `bind(element, props)` | Appliquer les props fournies à l’élément existant ; retourner une fonction de nettoyage de cette liaison      |
| `dispose(element)`     | Arrêter les effets et retirer les listeners gérés par la bibliothèque pour cet élément et son sous-arbre géré |
| `mount(target, tree)`  | Matérialiser et monter l’arbre ; retourner une fonction de nettoyage du montage                               |
| `renderToString(tree)` | Sérialiser l’arbre sans dépendance au DOM ni abonnement conservé                                              |

Exemple avec les chemins d’entrée retenus :

```tsx
/** @jsxImportSource @lilian1315/create-element/preact-signals */

import { signal } from '@preact/signals-core'
import { build } from '@lilian1315/create-element/preact-signals/dom'
import { dispose } from '@lilian1315/create-element/preact-signals/dom'

const count = signal(0)
const button = build<'button'>(
  <button
    class={{ counter: true }}
    style={{ color: 'red' }}
    data={{ testId: 'counter' }}
    onclick={() => count.value++}
  >
    {count}
  </button>,
)

document.body.append(button)

dispose(button)
button.remove()
```

`bind` initialise les éléments existants sans liaison active. Le partage du symbole empêche aussi de mélanger deux intégrations sur un même élément vivant.

## Contrats DOM

### Cycle de vie

- `dispose(element)` est idempotent. Il nettoie les ressources de la bibliothèque sans retirer l’élément ni restaurer son ancien état DOM.
- `element.remove()` est une opération DOM native ; elle ne déclenche pas automatiquement `dispose`.
- Le nettoyage retourné par `bind` arrête ses effets et retire ses listeners. Il laisse les dernières valeurs et le DOM appliqués.
- Les nettoyages retournés et `dispose(element)` doivent pouvoir être combinés sans double destruction.
- Le nettoyage d’un montage arrête ses ressources et retire le contenu appartenant à ce montage. Un ancien nettoyage ne doit pas détruire un montage ultérieur sur la même cible.
- Nettoyer un sous-arbre supprime les ressources que la bibliothèque y gère. Les listeners, abonnements et ressources externes ne deviennent pas automatiquement sa responsabilité.
- L’association entre un nœud et son nettoyage doit rester valide lorsqu’il est inséré dans un autre parent. Une WeakMap peut stocker cette association, mais la collecte mémoire n’est pas un mécanisme de désabonnement.
- Nettoyer l’ancien parent ou son montage ne désabonne pas un enfant qui a été déplacé ailleurs. Les scopes de ses ressources suivent le nœud, sans rester enfants du scope de son parent de création.

### `bind`, enfants et HTML brut

- Les propriétés absentes du nouvel objet ne doivent pas être effacées implicitement.
- Sans `children` ni `innerHTML`, conserver les enfants existants.
- Une propriété `children` explicitement présente avec `null` ou `undefined` vide les enfants. Une chaîne `innerHTML` vide les vide également.
- Rendre `children` et `innerHTML` mutuellement exclusifs dans les types de `h`, JSX et `bind`, et lever une erreur avant mutation si les deux sont présents à l’exécution.
- Le HTML brut est un contenu opaque. Préserver le contrat de contenu fourni comme fiable ou préalablement assaini ; le renderer ne parcourt pas son intérieur comme un arbre déclaratif.

### `class`, `style`, `data`

Conserver les formes actuellement utiles, y compris les sources réactives prises en charge. Ne pas réduire ces propriétés à de simples chaînes.

## Réactivité, build et types

- Le cœur importe des primitives statiques spécialisées au build : reconnaissance d’une source, lecture suivie, création d’un effet avec nettoyage, exécution sans suivi. Les détails de chaque bibliothèque restent dans son petit module d’intégration.
- La sélection du moteur disparaît de la signature de `mount`. La reconnaissance des signaux parmi les autres valeurs reste nécessaire.
- Utiliser une reconnaissance conforme à chaque moteur. La seule présence d’une propriété `.value` ne prouve pas qu’un objet est un signal.
- Produire les déclarations TypeScript correspondant au même moteur que le JavaScript. Vérifier les types publiés, pas seulement les types des sources.
- `Source<T>` conserve le type de la valeur native pour chaque prop et enfant. Les signaux de valeurs incompatibles et les sources `unknown` ne doivent pas contourner les contraintes de types. `bind` utilise les propriétés de l’élément reçu, avec la même union exclusive de contenu que `h` et JSX.
- Conserver une implémentation source commune pour les façades JSX ; générer ou assembler leurs distributions spécialisées. Maintenir les entrées techniques `jsx-runtime` et `jsx-dev-runtime`.
- Utiliser les `computed` natifs pour les valeurs dérivées. Une primitive supplémentaire `dynamic` ou `derive` n’est pas requise par ce brief.
- Proposition : fournir les enfants uniquement dans `props.children` pour `h`, avec un type récursif commun acceptant texte, valeurs vides, booléens ignorés, tableaux, descriptions, sources réactives et nœuds DOM côté client.
- Ne pas promettre que `build(<button />)` infère `HTMLButtonElement` : JSX efface cette précision. Préserver si possible l’inférence avec `build(h('button', ...))` et prévoir des références DOM typées au rendu.
- `build<'button'>(<button />)` retourne `HTMLButtonElement` ; le plugin signale une discordance littérale telle que `build<'input'>(<button />)`. Le paramètre générique est effacé à l’exécution : il n’effectue aucune validation runtime. Documenter les limites du contrôle syntaxique pour les variables et composants dont la racine n’est pas connue du plugin.

## `ref` : contrat retenu

`ref` est un callback typé contextuellement selon le tag, pouvant retourner une fonction de nettoyage : `(element: T) => void | (() => void)`. Le callback reçoit toujours un élément ; le nettoyage utilise la fonction retournée plutôt qu’un second appel avec `null`. Ce choix a été validé par l’utilisateur.

```tsx
<input
  ref={(input) => {
    // input : HTMLInputElement, inféré depuis le tag
    const release = initializeWidget(input)
    return release
  }}
/>
```

Règles :

- Réserver `ref` au renderer : ne pas l’assigner comme propriété DOM, ne pas la sérialiser et ne pas l’interpréter comme un signal ou une source dérivée.
- Appeler le callback synchroniquement après l’initialisation des props et des enfants de l’élément. Cela garantit un élément initialisé, pas sa connexion au document : `build` produit du DOM détaché.
- Exécuter son nettoyage une fois lorsque la liaison est détruite, lors de `dispose` ou lorsque le renderer supprime l’élément. Le remplacement des seuls enfants ne détruit pas la ref de leur parent.
- Le SSR n’appelle pas les refs. Le futur hydrateur pourra les appeler sur les éléments réutilisés.
- La forme publique retenue est uniquement le callback : aucun objet de référence ni helper `createRef` à implémenter.
- Une promesse peut être construite par l’utilisateur au-dessus du callback pour attendre une première disponibilité. Elle ne fait pas partie du contrat public de `ref`.
- Le comportement de `ref` transmis à `bind`, ainsi que son remplacement, doit suivre le même contrat de liaison et de nettoyage. Une ref portée par un composant utilisateur doit être explicitement transmise par celui-ci à un élément.

## Préparation de l’hydratation, sans implémentation

- Séparer la création d’un élément de l’application des props, de l’installation des effets et des listeners, et de la gestion des enfants.
- Partager les règles sémantiques DOM/SSR : normalisation des noms, namespaces, classes/styles/data, booléens et champs de formulaire.
- Permettre en interne d’installer le comportement d’un élément existant sans remplacer ses enfants. Le futur hydrateur ne pourra pas appeler aveuglément le `bind` public avec `children`, puisque celui-ci doit remplacer le sous-arbre.
- Représenter les zones dynamiques capables de contenir zéro, un ou plusieurs nœuds de façon à pouvoir retrouver leurs limites plus tard. Le format de marqueurs SSR hydratables reste une décision future.
- Le rendu serveur doit rester indépendant de `document` et lire sans suivi les sources et les composants exécutés. Conserver échappement, namespaces et règles des formulaires.
- Le transfert des données initiales, la politique de divergence serveur/client et les fonctions publiques d’hydratation restent hors du périmètre de cette implémentation.

## Travail et critères de fin

1. Lire les consignes du dépôt et les sources/tests actuels. S’appuyer sur la logique partagée existante plutôt que recopier les moteurs par intégration.
2. Formaliser les signatures et sémantiques ci-dessus, puis spécialiser le build et ses déclarations.
3. Implémenter les opérations DOM avec nettoyage cohérent et réutiliser leur logique de liaison interne. Maintenir le SSR selon le même contrat de props.
4. Migrer les exports, exemples, documentation et tests vers l’API finale ; supprimer les variantes devenues obsolètes.
5. Exécuter les validations prévues par le dépôt et les tests des exports construits. Signaler distinctement tout blocage d’environnement.

La refonte est terminée lorsque :

- chaque intégration fonctionne avec sa seule dépendance réactive, y compris JSX et les types publiés ;
- `build` produit du DOM détaché vivant, et `dispose(element)` arrête ses ressources de façon idempotente ;
- le plugin vérifie les correspondances de tags explicites sur `build` dans les formes qu’il sait analyser, sans helper `asDom` ;
- `ref` est typé selon le tag et respecte le contrat de disponibilité et de nettoyage choisi ;
- `bind` conserve les props absentes et remplace/nettoie intégralement les enfants lorsqu’un champ de contenu est fourni ;
- `class`, `style` et `data` conservent leurs formes et leurs mises à jour réactives ;
- les nœuds DOM opaques conservent leur identité côté client et sont explicitement refusés par le SSR ;
- les remplacements de sous-arbres et de montages ne laissent ni effets ni listeners de la bibliothèque actifs ;
- les tests vérifient la parité sémantique DOM/SSR et les propriétés significatives des formulaires, au-delà de comparaisons de chaînes HTML ;
- le SSR n’accède pas au DOM et ne crée pas d’abonnement conservé ;
- aucune API d’hydratation n’a été implémentée ou annoncée comme disponible.
