<div align="center">
  <h1>flowbite-pro-nextjs-admin-dashboard</h1>
  <p>
    Get started with a premium admin dashboard layout built with Next.js, Tailwind CSS and Flowbite featuring 21 example pages including charts, kanban board, mailing system, and more.
  </p>
  <p>
    <a href="https://discord.com/invite/4eeurUVvTy">
      <img src="https://img.shields.io/discord/902911619032576090?color=%237289da&label=Discord" alt="Flowbite on Discord" />
    </Link>
  </p>
</div>
<div align="center">
  <a href="https://flowbite-nextjs-admin-dashboard.vercel.app/">
    <img src="https://i.postimg.cc/vmW12Pqh/Screenshot.png" />
  </Link>
  <br />
</div>
<hr />

**You can [copy/paste code you want from this project](#how-to-use-in-your-own-project), or [use the whole thing for your website](#how-to-install).**

## Table of Contents

- [How to use in your own project](#how-to-use-in-your-own-project)
- [How to install](#how-to-install)
  - [Assumptions](#assumptions)
- [How to develop locally](#how-to-develop-locally)
- [How to build for production](#how-to-build-for-production)
- [How to deploy](#how-to-deploy)

## How to use in your own project

In this case, we assume you already have a [Next.js](https://nextjs.org) project.

You can copy any of the code from the `.tsx` files in `app` to your own Next.js project. Some pages contain optional dependencies discussed further below. Pages might also use some of the static files found in `public`.

Your Next.js project will also need to have [`flowbite-react`](https://github.com/bacali95/flowbite-react) installed. That's it! If you're unfamiliar, see [the open-source guide on how to install `flowbite-react`](https://github.com/themesberg/flowbite-react#getting-started).

Optional dependencies include:

- [`react-icons`](https://react-icons.github.io/react-icons/) for most of the many icons used
- [`react-apexcharts`](https://github.com/apexcharts/react-apexcharts) for charts/graphs found on [Dashboard page](https://github.com/themesberg/flowbite-react-admin-dashboard/blob/main/src/pages/index.tsx)
- [`react-sortablejs`](https://github.com/SortableJS/react-sortablejs) for Kanban-style boards found on [Kanban page](https://github.com/themesberg/flowbite-react-admin-dashboard/blob/main/src/pages/kanban.tsx)
- [`svgmap`](https://github.com/StephanWagner/svgMap) for maps found on [Dashboard page](https://github.com/themesberg/flowbite-react-admin-dashboard/blob/main/src/pages/kanban.tsx)

Finally, you can use your own back-end APIs by replacing the contents of the relevant `page.tsx` files. For example, if you would like to load JSON data from a remote server for the Dashboard, open `app/(dashboard)/(footer)/page.tsx` and replace the following:

```js
async function getData() {
  return { dashboard } as DashboardPageData;
}
```

By something like this:

```js
async function getData() {
  const remoteJSON = await fetch("https://remote-server-with-dashboard-data.com");
  return remoteJSON.json() as DashboardPageData;
}
```

You might also consider using a library like [zod](https://github.com/colinhacks/zod) to verify the JSON you receive from this remote API fits the schema outlined inside the `types` folder here.

As long as your remote server provides JSON that looks identical to our schema, you're good to go! Alternatively, you can always adjust the schema in `types` and update the relevant parameters referred to inside the front-end at `app/(dashboard)/(footer)/content.tsx`.

## How to install

### Assumptions

- You can open a shell/terminal/command prompt
- You have Git instaslled and can run `git` in the shell
- You have Node.js installed and can run `node`, `npm` in the shell

Clone this repository

```sh
git clone https://github.com/themesberg/flowbite-react-admin-dashboard.git
cd flowbite-pro-nextjs-admin-dashboard
```

Install dependencies for this project

```sh
npm i
```

## How to develop locally

This command will output a link to the local server.

```sh
npm run dev
```

## How to build for production

This command will build your server and client packages. For more information about what those look like, refer to [Vercel's docs on deploying Next.js](https://nextjs.org/docs/pages/building-your-application/deploying). Note: your code won't build if you have TypeScript errors or ESLint warnings.

```sh
npm run build
```

## How to deploy

Next.js projects are designed to be deployed most easily to [Vercel](https://vercel.com/docs/deployments/overview), but they can be deployed to other platforms, including your own Node.js server. Refer to [Vercel's docs on deploying Next.js](https://nextjs.org/docs/pages/building-your-application/deploying) for more information.
