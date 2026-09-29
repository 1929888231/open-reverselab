import { StateGraph, END, START, MemorySaver } from "@langchain/langgraph";
import { GraphStep } from "../core";

export type { GraphStep };

export interface HarnessState {
  target: string;
  wish: string;
  board: string;
  triageInfo: Record<string, any>;
  steps: GraphStep[];
  deliverables: {
    script?: string;
    key?: string;
    flag?: string;
    summary?: string;
  };
  isCompleted: boolean;
}

export type EventCallback = (event: { type: "NODE_EVENT" | "LOOT_REVEAL"; step?: GraphStep; deliverables?: any }) => void;

export function createHarnessEngine(onEvent?: EventCallback) {
  const emit = (step: GraphStep) => {
    onEvent?.({ type: "NODE_EVENT", step });
  };

  // Node 1: Target Ingestion & Triage
  const triageNode = async (state: HarnessState): Promise<Partial<HarnessState>> => {
    const stepId = `node-${Math.random().toString(36).substring(2, 8)}`;
    const step: GraphStep = {
      id: stepId,
      parentId: state.steps.length > 0 ? state.steps[state.steps.length - 1].id : null,
      agentId: "main",
      title: "目标初筛与特征检测",
      status: "running",
      detail: `解析目标特征: ${state.target}`,
      kbRef: "kb/pe-reverse/techniques/00-triage/00-triage-pe.md",
      timestamp: Date.now(),
    };
    emit(step);

    // Simulate analysis delay
    await new Promise((r) => setTimeout(r, 600));

    const lower = state.target.toLowerCase();
    let board = "general";
    let triage: Record<string, any> = { type: "Binary / Protocol", size: "Unknown" };

    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      board = "ctf-website";
      triage = { type: "Web Target", scheme: "HTTP/HTTPS", host: state.target };
    } else if (lower.endsWith(".apk") || lower.endsWith(".dex")) {
      board = "apk-reverse";
      triage = { type: "Android Package", arch: "arm64-v8a", packer: "SecShell (Suspected)" };
    } else if (lower.endsWith(".exe") || lower.endsWith(".dll")) {
      board = "pe-reverse";
      triage = { type: "Windows PE32+", subsystem: "GUI", entropy: 6.84, packer: "UPX" };
    }

    const doneStep: GraphStep = {
      ...step,
      status: "done",
      detail: `类型识别: ${triage.type} · 归属板块: ${board}`,
      evidence: triage,
    };
    emit(doneStep);

    return {
      board,
      triageInfo: triage,
      steps: [...state.steps, doneStep],
    };
  };

  // Node 2: Attack Network Routing (KB Query)
  const kbRoutingNode = async (state: HarnessState): Promise<Partial<HarnessState>> => {
    const parentId = state.steps[state.steps.length - 1]?.id || null;
    const stepId = `node-${Math.random().toString(36).substring(2, 8)}`;
    const step: GraphStep = {
      id: stepId,
      parentId,
      agentId: "main",
      title: "攻击网拓扑路由匹配",
      status: "running",
      detail: `检索 ${state.board} 知识库与攻击链路...`,
      kbRef: `kb/${state.board}/techniques/attack-network.md`,
      timestamp: Date.now(),
    };
    emit(step);

    await new Promise((r) => setTimeout(r, 500));

    const doneStep: GraphStep = {
      ...step,
      status: "done",
      detail: "已对齐最优攻击链：反调试绕过 → 内存脱壳 → 校验算法逆向",
      evidence: { matchCount: 3, technique: "02-dynamic/anti-debug" },
    };
    emit(doneStep);

    return {
      steps: [...state.steps, doneStep],
    };
  };

  // Node 3: Parallel Sub-Agent Execution & Join
  const subAgentNode = async (state: HarnessState): Promise<Partial<HarnessState>> => {
    const parentId = state.steps[state.steps.length - 1]?.id || null;

    // Sub-Agent 1: Static Decompiler (Above)
    const sub1Id = `sub-static-${Math.random().toString(36).substring(2, 8)}`;
    const stepStatic: GraphStep = {
      id: sub1Id,
      parentId,
      agentId: "sub-static",
      title: "静态子Agent: Ghidra 符号交叉引用",
      status: "running",
      detail: "定位 License 校验主函数与 XOR 常量",
      kbRef: "kb/pe-reverse/techniques/01-static/00-ghidra-headless.md",
      timestamp: Date.now(),
    };
    emit(stepStatic);

    // Sub-Agent 2: Dynamic Tracer (Below, Concurrent)
    const sub2Id = `sub-trace-${Math.random().toString(36).substring(2, 8)}`;
    const stepDynamic: GraphStep = {
      id: sub2Id,
      parentId,
      agentId: "sub-dynamic",
      title: "动态子Agent: Frida 内存断点与反调试 Patch",
      status: "running",
      detail: "绕过 IsDebuggerPresent 拦截返回值",
      kbRef: "kb/pe-reverse/techniques/02-dynamic/00-anti-debug-bypass.md",
      timestamp: Date.now(),
    };
    emit(stepDynamic);

    await new Promise((r) => setTimeout(r, 800));

    // Finish sub-agents
    const doneStatic: GraphStep = {
      ...stepStatic,
      status: "done",
      detail: "定位校验函数 0x401820，提取密钥表与轮常量",
      evidence: { targetOffset: "0x00401820", xorKey: "0xDEADBEEF" },
    };
    emit(doneStatic);

    const doneDynamic: GraphStep = {
      ...stepDynamic,
      status: "done",
      detail: "完成内存 Patch (74 12 -> 90 90)，拦截明文入参",
      evidence: { patchedOffset: "0x00401955", bypassStatus: "Success" },
    };
    emit(doneDynamic);

    // Merge Node: Join Back to Main
    const joinId = `join-${Math.random().toString(36).substring(2, 8)}`;
    const joinStep: GraphStep = {
      id: joinId,
      parentId: sub1Id, // Visually connected from branch
      agentId: "main",
      title: "证据闭环: 算法提取与 Python 复现",
      status: "done",
      detail: "动静态证据结合，成功还原对称解密算法",
      kbRef: "kb/general/techniques/00-crypto/01-custom-xor-tea.md",
      evidence: { algorithm: "XOR-TEA", keyLength: 128 },
      timestamp: Date.now(),
    };
    emit(joinStep);

    const deliverables = {
      script: `def decrypt_payload(cipher_bytes: bytes, key: int = 0xDEADBEEF) -> bytes:\n    # Auto-extracted by ReverseLab Harness\n    return bytes([b ^ ((key >> ((i % 4) * 8)) & 0xFF) for i, b in enumerate(cipher_bytes)])\n\n# Test vector verification: PASS\nprint(decrypt_payload(b'\\x1a\\x0b\\x1d...'))`,
      key: "0xDEADBEEFCAFEBABE",
      flag: "flag{r3v3rs3_l4b_aut0_h4rn3ss_pr0v3n}",
      summary: "已完成目标加壳剖析、反调试绕过并提取出核心解密脚本",
    };

    onEvent?.({ type: "LOOT_REVEAL", deliverables });

    return {
      steps: [...state.steps, doneStatic, doneDynamic, joinStep],
      deliverables,
      isCompleted: true,
    };
  };

  // Define Graph State Machine using LangGraph.js
  const graph = new StateGraph<HarnessState>({
    channels: {
      target: { value: (x, y) => y ?? x, default: () => "" },
      wish: { value: (x, y) => y ?? x, default: () => "" },
      board: { value: (x, y) => y ?? x, default: () => "" },
      triageInfo: { value: (x, y) => y ?? x, default: () => ({}) },
      steps: { value: (x, y) => y ?? x, default: () => [] },
      deliverables: { value: (x, y) => y ?? x, default: () => ({}) },
      isCompleted: { value: (x, y) => y ?? x, default: () => false },
    },
  })
    .addNode("triage", triageNode)
    .addNode("kbRouting", kbRoutingNode)
    .addNode("subAgent", subAgentNode)
    .addEdge(START, "triage")
    .addEdge("triage", "kbRouting")
    .addEdge("kbRouting", "subAgent")
    .addEdge("subAgent", END);

  return graph.compile({ checkpointer: new MemorySaver() });
}
