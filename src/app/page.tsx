export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Construblock
      </h1>
      <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Diseño y validación de mampostería confinada según la metodología simplificada
        AGIES DSE 4.1. En construcción — Fase 1: scaffolding del proyecto.
      </p>
    </div>
  );
}
