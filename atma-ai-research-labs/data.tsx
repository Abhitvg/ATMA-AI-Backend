import React from 'react';
import { Brain, Cpu, Zap, Plane, Factory, Eye, Radio } from 'lucide-react';

export const TECH_ITEMS = [
  {
    title: "HIERARCHICAL REASONING",
    subtitle: "Utilizing explicit executive Working Memory and bilateral PFC-parietal circuits for multi-step stateful decision making.",
    icon: <Brain size={32} />
  },
  {
    title: "INT8 QUANTIZATION",
    subtitle: "Deployed on NVIDIA Jetson Orin/Xavier. Custom TensorRT export pipeline. <15W Power Envelope.",
    icon: <Cpu size={32} />
  },
  {
    title: "LINEAR-TIME CONTEXT",
    subtitle: "Selective state-space mechanisms to solve Transformer latency bottlenecks in GPS-denied environments.",
    icon: <Zap size={32} />
  }
];

export const USE_CASES = [
  {
    icon: <Plane size={24} />,
    title: "GPS-DENIED NAVIGATION",
    sector: "AEROSPACE / DEFENSE",
    problem: "In signal-jammed environments, UAVs relying on GPS or cloud-link become inert or erratic.",
    solution: "ATMA runs fully onboard (Edge). It builds a symbolic 3D world model from raw visual feed to navigate complex topographies without external signals."
  },
  {
    icon: <Factory size={24} />,
    title: "ADAPTIVE MANIPULATION",
    sector: "INDUSTRIAL ROBOTICS",
    problem: "Hard-coded robots fail when objects are slightly displaced. LLMs are too slow (latency) for real-time control.",
    solution: "Our 'Slot-Attention' encoder decomposes the scene into discrete objects, allowing the arm to reason about displacement physics in <15ms."
  },
  {
    icon: <Eye size={24} />,
    title: "COGNITIVE SURVEILLANCE",
    sector: "SECURITY",
    problem: "Current vision systems flood operators with false positives (motion detection) and lack context.",
    solution: "ATMA understands intent. It distinguishes between a 'workman carrying a drill' and a 'threat actor', reducing analyst load by 94%."
  },
  {
    icon: <Radio size={24} />,
    title: "AUTONOMOUS REPAIR",
    sector: "INFRASTRUCTURE",
    problem: "Remote energy assets require costly human inspection. Stochastic AI misses subtle hairline fractures.",
    solution: "Symbolic verification ensures the AI checks every safety parameter against a rigorous rule set before authorizing a 'safe' status."
  }
];

export const TEAM_MEMBERS = [
  {
    name: "Abhishek Singh",
    role: "FOUNDER",
    specs: "M.Tech CSE (JNU). Ex-ZedBlock Engineer. Specialist in Full-Stack Scalability, High-Concurrency APIs, and Automated Bias Detection Systems."
  },
  {
    name: "Avadhesh Kumar",
    role: "LEAD ARCHITECT",
    specs: "M.Tech Computer Technology (IIT Delhi). Thesis Supervisor: Prof. Santanu Chaudhary. Expert in RISC-V, xv6 Kernel Modification, and Brain-Inspired AI."
  }
];

export const ROADMAP_MILESTONES = [
  {
    year: "2024",
    quarter: "Q4",
    title: "SEED FOUNDATION",
    description: "Core team assembly. Alpha version of Slot-Attention encoder trained on synthetic datasets."
  },
  {
    year: "2025",
    quarter: "Q2",
    title: "SYMBOLIC INTEGRATION",
    description: "Integration of neuro-symbolic solver. First successful demo of counterfactual reasoning in robotic manipulation."
  },
  {
    year: "2026",
    quarter: "Q1",
    title: "COMMERCIAL PILOT",
    description: "Deployment of ATMA V1 in controlled industrial warehouse environments. 99.9% safety guarantee."
  },
  {
    year: "2027",
    quarter: "Q3",
    title: "GENERAL AUTONOMY",
    description: "Expansion to unstructured outdoor environments. Defense and Search & Rescue contracts initiated."
  }
];