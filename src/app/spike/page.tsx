'use client';

import dynamic from 'next/dynamic';

// react-konva necesita `window`; el editor se carga solo en el cliente.
// (En Next 16, `dynamic(..., { ssr: false })` debe usarse dentro de un
// componente cliente — por eso esta página lleva 'use client'.)
const EditorSpike = dynamic(() => import('@/components/spike/EditorSpike'), {
  ssr: false,
});

export default function SpikePage() {
  return <EditorSpike />;
}
