"use client";

import { NumberSystemConverter } from "./NumberSystemConverter";
import { PermissionsVisualizer } from "./PermissionsVisualizer";
import { GitWorkflowVisualizer } from "./GitWorkflowVisualizer";
import { FilesystemExplorer } from "./FilesystemExplorer";
import { CpuSchedulingVisualizer } from "./CpuSchedulingVisualizer";
import { MemoryStorageCalculator } from "./MemoryStorageCalculator";
import { NetworkPacketVisualizer } from "./NetworkPacketVisualizer";
import { AiLlmVisualizer } from "./AiLlmVisualizer";

export function VisualizersHub() {
  return (
    <div className="space-y-6">
      <PermissionsVisualizer />
      <NumberSystemConverter />
      <GitWorkflowVisualizer />
      <FilesystemExplorer />
      <CpuSchedulingVisualizer />
      <MemoryStorageCalculator />
      <NetworkPacketVisualizer />
      <AiLlmVisualizer />
    </div>
  );
}
