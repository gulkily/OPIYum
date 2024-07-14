import React, { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import { createNodeImageProgram } from "@sigma/node-image";
import SentientData from "./Sentient AI.json";

console.log(SentientData);

const SimpleGraph = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const graph = new Graph();

    // Add nodes
    graph.addNode("a", {
      x: 0,
      y: 0,
      size: 20,
      label: "A",
      color: "pink",
      pictoColor: "red",
      image: "https://icons.getbootstrap.com/assets/icons/person.svg",
    });
    graph.addNode("b", {
      x: 1,
      y: -1,
      size: 40,
      label: "B",
      color: "yellow",
      pictoColor: "red",
      image: "https://icons.getbootstrap.com/assets/icons/building.svg",
    });
    graph.addNode("c", {
      x: 3,
      y: -2,
      size: 20,
      label: "C",
      color: "yellow",
      pictoColor: "red",
      image: "https://icons.getbootstrap.com/assets/icons/chat.svg",
    });
    graph.addNode("d", {
      x: 1,
      y: -3,
      size: 20,
      label: "D",
      color: "pink",
      pictoColor: "blue",
      image: "https://icons.getbootstrap.com/assets/icons/database.svg",
    });
    graph.addNode("e", {
      x: 3,
      y: -4,
      size: 40,
      label: "E",
      color: "pink",
      pictoColor: "blue",
      image: "https://icons.getbootstrap.com/assets/icons/building.svg",
    });
    graph.addNode("f", {
      x: 4,
      y: -5,
      size: 20,
      label: "F",
      color: "yellow",
      pictoColor: "blue",
      image: "https://icons.getbootstrap.com/assets/icons/database.svg",
    });

    // Add edges
    graph.addEdge("a", "b", { size: 10 });
    graph.addEdge("b", "c", { size: 10 });
    graph.addEdge("b", "d", { size: 10 });
    graph.addEdge("c", "b", { size: 10 });
    graph.addEdge("c", "e", { size: 10 });
    graph.addEdge("d", "c", { size: 10 });
    graph.addEdge("d", "e", { size: 10 });
    graph.addEdge("e", "d", { size: 10 });
    graph.addEdge("f", "e", { size: 10 });

    // Create the node image program
    const NodePictogramCustomProgram = createNodeImageProgram({
      padding: 0.15,
      size: { mode: "force", value: 256 },
      drawingMode: "color",
      colorAttribute: "pictoColor",
    });

    // Initialize Sigma
    const renderer = new Sigma(graph, container, {
      defaultNodeType: "pictogram",
      nodeProgramClasses: {
        pictogram: NodePictogramCustomProgram,
      },
    });

    // Cleanup on unmount
    return () => {
      renderer.kill();
    };
  }, []);

  return (
    <div
      id="sigma-container"
      ref={containerRef}
      style={{ width: "100%", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}
    ></div>
  );
};

export default SimpleGraph;