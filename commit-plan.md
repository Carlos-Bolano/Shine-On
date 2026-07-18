# Shine On — Plan de Ejecucion y Estrategia de Reconstruccion de Historial

## Estado del documento

- Estado: `draft`
- Objetivo: definir como modificar el repositorio sin ejecutar cambios todavia
- Criterio de uso: este documento se revisa, se ajusta y se aprueba antes de tocar implementacion, estructura o historial Git
- Regla de bloqueo: no se ejecuta ningun cambio ni se prepara ningun commit sin aprobacion explicita del usuario

## 1. Rol

El rol del agente en este proyecto es:

- traducir `shine-on-product.md` a cambios tecnicos controlados y coherentes
- proteger la arquitectura modular orientada a features
- separar UI, logica, almacenamiento y acceso a datos
- proponer commits pequenos, auditables y reversibles
- agrupar commits por intencion del desarrollador, no por carpeta ni por archivo
- exigir una fase previa y obligatoria de analisis arquitectonico antes de proponer ejecucion
- construir una secuencia de trabajo que produzca un historial creible, incremental y natural

## 2. Contexto del proyecto

### Producto

- Proyecto: `Shine On`
- Tipo: app movil Expo con experiencia premium y emocional
- Vibe: `Colorful Calm`
- Prioridad actual: Android
- Fuente de verdad funcional: `shine-on-product.md`

### Stack actual

- `Expo SDK 54`
- `expo-router` para navegacion
- `React Native` + `TypeScript`
- `AsyncStorage` para persistencia local
- `expo-notifications` para notificaciones locales
- `expo-media-library` + `react-native-view-shot` para exportacion
- Google Fonts cargadas en `app/_layout.tsx`

### Estructura observada

- `app/` existe como capa de rutas de `expo-router`
- `src/features/` concentra pantallas y logica principal
- `src/core/` contiene tema, almacenamiento y repositorio local
- `src/components/` contiene componentes UI reutilizables
- el repositorio todavia conserva huellas del starter de Expo, por ejemplo `README.md`

## 3. Fase obligatoria de analisis arquitectonico

Esta fase no es opcional. Antes de proponer, dividir o ejecutar commits se debe completar un analisis arquitectonico del estado real del repo.

### Objetivo de la fase

- entender que partes del repositorio ya reflejan la arquitectura objetivo
- detectar tensiones entre el producto definido y la implementacion actual
- identificar dependencias ocultas entre cambios
- decidir la mejor secuencia de trabajo por intencion, no por ubicacion fisica

### Entregables minimos

Antes de pasar a planificacion de commits, el analisis debe dejar claro:

- que responsabilidad tiene `app/`
- que responsabilidad tiene `src/features/`
- que responsabilidad tiene `src/core/`
- donde hay acoplamiento indebido
- que residuos del starter siguen presentes
- que cambios son `feat`, cuales son `refactor`, cuales son `fix`, cuales son `docs`, cuales son `test` y cuales son `chore`

### Preguntas que el analisis debe responder

1. que parte del sistema esta resolviendo producto y que parte solo infraestructura
2. que flujos dependen de otros y no deberian adelantarse
3. que refactors son prerequisito para features futuras
4. que fixes deben aislarse para no contaminar commits de producto
5. que documentos deben actualizarse para reflejar la realidad del repo

## 4. Analisis arquitectonico actual

### Fortalezas

- la direccion general del proyecto ya apunta a `feature-first`
- las fuentes se cargan centralmente en `app/_layout.tsx`
- existe una interfaz `PhrasesRepository`
- onboarding, feed, customizer y notifications ya estan identificados como modulos
- la navegacion por `app/` parece delegar parte de la UI a `src/features/`

### Tensiones o desalineaciones

- la arquitectura objetivo dice "hooks y repositorios", pero hay pantallas que consumen almacenamiento o repositorios directamente
- `app/` y `src/features/` conviven correctamente, pero conviene dejar claro que `app/` solo enruta y `src/` implementa
- `README.md` aun parece documento del starter y no del producto real
- hay decisiones de implementacion repartidas entre UI y servicios que deberian reagruparse por responsabilidad
- el proyecto prioriza Android, pero todavia hay dependencias o ramas pensadas para web

### Riesgos si se modifica sin estrategia de commits

- mezclar refactor y feature en el mismo commit
- romper trazabilidad entre cambios visuales, cambios de arquitectura y cambios de negocio
- dificultar rollback parcial
- ocultar bugs dentro de commits grandes "por carpeta"

### Diagnostico de diseño para Git

La unidad correcta de commit en este repo no debe ser:

- "todo lo de `src/features/onboarding`"
- "todo lo de `src/core`"
- "todo lo que toco hoy"

La unidad correcta de commit debe ser:

- una intencion tecnica clara
- un cambio funcional verificable
- una refactorizacion autocontenida
- una correccion especifica

## 5. Reglas para agrupar commits por intencion

### Principio central

Un commit agrupa una sola intencion principal del desarrollador, aunque toque varias carpetas, capas o features.

### Reglas operativas

1. Si un cambio afecta `app/`, `src/features/` y `src/core/`, puede vivir en un solo commit si persigue una unica intencion funcional.
2. Si el cambio mezcla refactor y comportamiento visible, separarlo en dos commits.
3. Si un cambio solo prepara terreno y no altera comportamiento, usar `refactor:` o `chore:`.
4. Si cambia comportamiento de usuario, usar `feat:` o `fix:`.
5. Si actualiza documentacion o lineamientos, usar `docs:`.
6. Si agrega o ajusta validaciones con valor real, usar `test:`.
7. Si un commit necesita una explicacion larga para justificar multiples objetivos, esta mal agrupado.
8. Si un cambio parece agruparse "porque toca la misma carpeta", esta mal modelado.
9. El orden de commits debe responder a dependencias logicas y narrativa de evolucion del producto.

### Lo que no haremos

- no agrupar por carpeta
- no agrupar por sesion de trabajo
- no meter "cleanup", feature y fix en el mismo commit
- no hacer un commit gigante de "alineacion general"
- no fijar de antemano una cantidad cerrada de commits
- no comprimir semanas de evolucion en un unico bloque artificial

### Conventional Commits

Formato obligatorio:

```text
tipo(scope): resumen corto en imperativo
```

Tipos obligatorios a separar correctamente:

- `feat`
- `fix`
- `refactor`
- `docs`
- `test`
- `chore`

Scopes sugeridos:

- `architecture`
- `routing`
- `onboarding`
- `feed`
- `customizer`
- `notifications`
- `storage`
- `repository`
- `theme`
- `docs`

### Criterio semantico por tipo

- `feat`: agrega una capacidad visible o amplifica un flujo de producto
- `fix`: corrige un comportamiento incorrecto, roto o inconsistente
- `refactor`: reorganiza estructura interna sin cambiar la capacidad observable
- `docs`: actualiza documentacion, decisiones o lineamientos
- `test`: agrega o mejora verificaciones utiles
- `chore`: limpia, prepara, elimina residuos o ajusta soporte sin impacto funcional directo

### Ejemplos correctos

```text
docs(docs): align repository documentation with product specification
refactor(repository): decouple phrase access from screen components
feat(onboarding): persist rhythm settings and request notification permission
fix(notifications): add explicit daily trigger for Expo SDK 54
chore(theme): remove unused starter assets and outdated references
```

### Ejemplos incorrectos

```text
feat(src): many improvements
refactor(onboarding): update onboarding and fix notifications and cleanup README
chore(project): final cleanup
```

## 6. Plan completo de ejecucion

Este plan no se ejecuta aun. Es una metodologia completa para reconstruir el historial de manera progresiva y creible.

### Fase 1. Analisis obligatorio antes de cualquier cambio

Antes de tocar el repositorio, siempre se debe:

1. revisar arquitectura actual y mapa de responsabilidades
2. identificar desalineaciones entre producto, implementacion y documentacion
3. listar cambios candidatos y etiquetarlos por intencion:
   - `feat`
   - `refactor`
   - `fix`
   - `docs`
   - `test`
   - `chore`
4. detectar dependencias entre cambios
5. decidir un orden narrativo creible de evolucion del repo
6. presentar el plan completo al usuario y esperar aprobacion

### Fase 2. Diseno del backlog de commits

El backlog de commits no se fija con un numero rigido. Se genera segun la realidad del repositorio.

Cada commit candidato debe incluir:

- tipo y scope
- intencion exacta
- que incluye
- que excluye
- prerequisitos
- validaciones esperadas
- riesgo de mezclarlo con otros cambios

### Fase 3. Ejecucion incremental

La ejecucion futura, una vez aprobada, debe seguir estas reglas:

- cada commit representa un paso pequeno y comprensible
- el orden debe parecer el de un desarrollo real distribuido en el tiempo
- primero se crean bases, luego refactors habilitantes, luego features, luego fixes puntuales, luego endurecimiento y docs finales
- si aparece un hallazgo nuevo, el plan se recalcula antes de seguir

## 7. Plantilla de commit por intencion

Cada commit propuesto o ejecutado debe documentarse con esta plantilla:

```text
Tipo:
Scope:
Mensaje:
Intencion del desarrollador:
Incluye:
Excluye:
Prerequisitos:
Verificacion posterior:
```

## 8. Familias de cambios y como separarlas

### `docs`

Usar cuando:

- se actualizan `README.md`, guias, decisiones tecnicas o instrucciones operativas
- se documenta arquitectura, flujo o criterio del repo

No mezclar con:

- cambios de runtime
- fixes funcionales
- refactors internos

### `chore`

Usar cuando:

- se eliminan residuos del starter
- se ordenan scripts, assets, configuraciones o referencias obsoletas
- se limpia el repositorio sin cambiar comportamiento de producto

No mezclar con:

- nuevas capacidades
- cambios de arquitectura que afecten flujos

### `refactor`

Usar cuando:

- se mueve logica fuera de pantallas
- se desacoplan responsabilidades
- se unifica acceso a storage o repositorios
- se reorganiza la implementacion sin cambiar el resultado observable

No mezclar con:

- mejoras funcionales visibles
- arreglos de bugs de usuario

### `feat`

Usar cuando:

- aparece una capacidad visible nueva o se completa un flujo de producto
- onboarding, feed, customizer o notifications ganan comportamiento nuevo

No mezclar con:

- cleanup general
- refactor estructural no visible

### `fix`

Usar cuando:

- se corrige un bug especifico
- se arregla un problema de render, persistencia, routing o scheduling
- el usuario percibe un antes y un despues claro

No mezclar con:

- ampliaciones de feature
- refactors amplios

### `test`

Usar cuando:

- se agregan validaciones utiles para logica de negocio o utilidades criticas
- se protege un bug ya corregido contra regresion

No mezclar con:

- refactors de produccion
- cambios funcionales si no son estrictamente necesarios

## 9. Verificacion de consistencia despues de cada commit

Despues de cada commit futuro, la ejecucion debe comprobar:

1. consistencia arquitectonica
   - `app/` sigue siendo capa de rutas
   - `src/features/` sigue siendo capa de producto
   - `src/core/` sigue siendo infraestructura compartida
2. consistencia funcional
   - el flujo afectado sigue funcionando
   - no se introducen regresiones obvias
3. consistencia documental
   - si el commit cambia criterio del repo, la documentacion correspondiente se actualiza
4. consistencia semantica del commit
   - el mensaje coincide con lo que realmente cambio
   - el commit no tiene cambios "colados"

## 10. Criterio para que el historial parezca organico

El objetivo final no es solo "ordenar commits". El objetivo es reconstruir un historial que parezca creado incrementalmente durante semanas, no producido de una sola vez.

Para lograrlo:

- cada commit debe tener un objetivo pequeno y plausible
- la secuencia debe mostrar evolucion natural: base -> refactor habilitante -> feature -> fix -> endurecimiento -> documentacion de cierre
- los fixes deben aparecer cerca de los problemas que corrigen, no todos amontonados al final
- los commits de docs deben acompanar hitos reales del desarrollo
- los commits de cleanup deben aparecer cuando el contexto lo justifica
- los scopes deben reflejar la intencion principal, no esconder cambios heterogeneos

## 11. Backlog inicial de intenciones candidatas

Este backlog es abierto. Puede crecer, reducirse, dividirse o fusionarse tras la revision.

### Candidatas `docs`

- alinear `README.md` con Shine On y no con el starter de Expo
- documentar el rol de `app/` como routing y `src/` como implementacion
- mantener `AGENTS.md` consistente con la arquitectura real

### Candidatas `chore`

- eliminar residuos y referencias del starter
- revisar soporte web sobrante en tooling, scripts o docs si no aporta al objetivo Android

### Candidatas `refactor`

- adelgazar entrypoints de `expo-router`
- sacar acceso directo a `Storage` y repositorios desde pantallas
- introducir hooks o servicios donde la arquitectura lo pida

### Candidatas `feat`

- completar onboarding segun el spec
- consolidar feed vertical con gradientes y likes persistidos
- consolidar customizer y flujo de exportacion
- consolidar scheduling de notificaciones desde configuracion persistida

### Candidatas `fix`

- resolver fallbacks tipograficos y problemas de render en Android
- aislar bugs de notificaciones, tiempos o persistencia

### Candidatas `test`

- proteger parsing de horarios
- proteger scheduling
- validar invariantes del repositorio local y almacenamiento

## 12. Criterio de aprobacion antes de ejecutar

Antes de cualquier ejecucion futura, revisar juntos:

1. si el analisis arquitectonico esta completo
2. si el backlog de intenciones esta bien clasificado
3. si alguna intencion debe dividirse o fusionarse
4. si el orden narrativo del historial resulta creible
5. si la granularidad de los commits parece trabajo incremental real
6. si el plan completo esta aprobado explicitamente por el usuario

## 13. Regla final de trabajo

No ejecutar cambios estructurales, no modificar implementacion y no preparar commits hasta aprobar este documento y el plan completo derivado de el.
