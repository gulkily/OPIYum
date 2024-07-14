import React, { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import circular from "graphology-layout/circular";

//USING THE CATEGORIES HERE FOR NOW

const SimpleGraph = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const graph = new Graph();

    // Sample JSON data
    const jsonData = [
      {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "David Chalmers",
        "relevance": "A prominent philosopher of mind known for his work on the 'hard problem' of consciousness, which is directly relevant to defining and understanding sentience in AI.",
        "url": "https://en.wikipedia.org/wiki/Hard_problem_of_consciousness",
        "explanation": "David Chalmers' formulation of the hard problem of consciousness and its implications for understanding sentience."
      },
      {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Nick Bostrom",
        "relevance": "A philosopher known for his work on the future of AI and its ethical implications, providing insights into the responsible creation of sentient AI.",
        "url": "https://www.reddit.com/r/singularity/comments/12x9k1f/nick_bostrom_says_ai_chatbots_may_have_some/",
        "explanation": "A Reddit discussion on Nick Bostrom's views on AI sentience, including the spectrum of intelligence and sentience."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Current AI Capabilities and Limitations",
        "expert": "Yoshua Bengio",
        "relevance": "A leading AI researcher known for his work on deep learning, which is fundamental for advancing AI towards higher-level cognitive functions.",
        "url": "https://www.youtube.com/watch?v=ojZB6fzpXGQ",
        "explanation": "Conversation with Yoshua Bengio on AI safety, sentience, and agency, discussing the risks and challenges of achieving human-level competence in AI."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Fei-Fei Li",
        "relevance": "An AI researcher with a focus on computer vision and understanding how machines can perceive and interpret the world, relevant to developing sentient AI.",
        "url": "https://www.youtube.com/watch?v=gzOwpEupP5w",
        "explanation": "Fei-Fei Li's lecture on AI with a human perspective, discussing the intersection of computer vision and cognitive science."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Thomas Metzinger",
        "relevance": "A philosopher who studies the nature of self-consciousness and the ethical implications of artificial consciousness.",
        "url": "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.01535/full",
        "explanation": "Article discussing the importance of considering consciousness in AI and robotics, including philosophical reflections on self-awareness and adaptation."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Thomas Metzinger",
        "relevance": "A philosopher who studies the nature of self-consciousness and the ethical implications of artificial consciousness.",
        "url": "https://www.vox.com/future-perfect/351893/consciousness-ai-machines-neuroscience-mind",
        "explanation": "Article exploring the debate on whether AI can become conscious, including the perspective of philosopher Thomas Metzinger on the potential risks and ethical implications."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Thomas Metzinger",
        "relevance": "A philosopher who studies the nature of self-consciousness and the ethical implications of artificial consciousness.",
        "url": "https://www.sentienceinstitute.org/podcast/episode-18.html",
        "explanation": "Podcast episode featuring Thomas Metzinger discussing the ethical implications of artificial sentience and the need for caution in AI development."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Thomas Metzinger",
        "relevance": "A philosopher who studies the nature of self-consciousness and the ethical implications of artificial consciousness.",
        "url": "https://undark.org/2023/07/14/interview-the-ethical-puzzle-of-sentient-ai/",
        "explanation": "Interview with philosopher Jonathan Birch discussing the moral concerns and ethical questions raised by the potential for conscious AI."
    },
    {
        "question": "How can we create a truly sentient artificial intelligence?",
        "category": "Definition of Sentience and Consciousness",
        "expert": "Thomas Metzinger",
        "relevance": "A philosopher who studies the nature of self-consciousness and the ethical implications of artificial consciousness.",
        "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10710150/",
        "explanation": "Academic paper reviewing the state of artificial consciousness research, including the importance of understanding consciousness for creating ethical AI systems."
    },
      // Add more JSON objects here...
    ];

    // Create the main question node with coordinates (0, 0)
    const questionNode = "How can we create a truly sentient artificial intelligence?";
    graph.addNode(questionNode, { label: questionNode, size: 30, color: "blue", x: 0, y: 0 });

    // Process JSON data to create nodes and edges
    jsonData.forEach((item) => {
      const categoryNode = item.category;
      const expertNode = item.expert;
      const urlNode = item.url;

      // Add category node if it doesn't exist
      if (!graph.hasNode(categoryNode)) {
        graph.addNode(categoryNode, { label: categoryNode, size: 20, color: "green" });
        graph.addEdge(questionNode, categoryNode);
      }

      // Add expert node if it doesn't exist
      if (!graph.hasNode(expertNode)) {
        graph.addNode(expertNode, { label: expertNode, size: 15, color: "orange" });
        graph.addEdge(categoryNode, expertNode);
      }

      // Add URL node
      graph.addNode(urlNode, { label: urlNode, size: 10, color: "red" });
      graph.addEdge(expertNode, urlNode);
    });

    // Apply circular layout to automatically assign coordinates
    circular.assign(graph);

    // Initialize Sigma
    const renderer = new Sigma(graph, container);

    // Cleanup on unmount
    return () => {
      renderer.kill();
    };
  }, []);

  return <div id="sigma-container" ref={containerRef} style={{ width: "100%", height: "800px" }}></div>;
};

export default SimpleGraph;