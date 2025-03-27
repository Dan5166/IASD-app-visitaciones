This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Sobre el proyecto
Este proyecto es una pagina de agendar y control de visitaciones para la Iglesia Adventista de Las Condes.

La pagina cuenta con:
- Calendario para pedir horas
- Autenticacion
- Pagina de administracion del sitio
- Subida de archivos

Pronto se agregaran:
- Seleccion de idioma entre los principales del PO
- Envio de correos de notificacion
- Chat interno para coordinacion de los visitadores

## Inicializar el proyecto

Para correr el ***servidor local de desarrollo***:

```bash
npm run dev
# or
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Pronto habra documentacion sobre cual es la idea general de cada pagina y componente.

## Recursos de Next.js

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## TODO
- Hacer que funcionen las horas de manana y de tarde con un estado, para que no se renderice el titulo en caso de no haber
- Anadir direccion de casa - Solo si la persona elige visita en casa
- Arreglar funcionamiento de Navbar en ver-horas
- Espanol - Portugues - Ingles - Frances
- Componentizar mejor codigo y revisar que deberia ser componente de servidor y componente de cliente