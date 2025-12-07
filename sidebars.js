// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction'
    },
    {
      type: 'category',
      label: 'Module 1: Introduction to Physical AI',
      items: [
        'module-1/introduction',
        'module-1/embodied-intelligence',
        'module-1/digital-to-physical-gap',
        'module-1/simulation-first-design'
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Robotic Nervous System (ROS 2)',
      items: [
        'module-2/ros2-intro',
        'module-2/nodes-topics-services',
        'module-2/rclpy-integration',
        'module-2/urdf-humanoid'
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The Digital Twin (Gazebo & Unity)',
      items: [
        'module-3/digital-twin-intro',
        'module-3/gazebo-simulation',
        'module-3/unity-hri',
        'module-3/sensor-simulation'
      ],
    },
    {
      type: 'category',
      label: 'Module 4: The AI-Robot Brain (NVIDIA Isaac)',
      items: [
        'module-4/ai-robot-brain-intro',
        'module-4/isaac-sim',
        'module-4/isaac-ros',
        'module-4/nav2-humanoid'
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Vision-Language-Action Systems (VLA)',
      items: [
        'module-5/vla-intro',
        'module-5/voice-to-action',
        'module-5/cognitive-planning',
        'module-5/vision-guided-manipulation'
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Humanoid Robotics Architecture',
      items: [
        'module-6/humanoid-arch-intro',
        'module-6/biped-control',
        'module-6/balance-locomotion',
        'module-6/perception-loops'
      ],
    },
    {
      type: 'category',
      label: 'Module 7: RAG Chatbot Integration',
      items: [
        'module-7/rag-intro',
        'module-7/openai-agents',
        'module-7/fastapi-backend',
        'module-7/embedded-assistant'
      ],
    },
    {
      type: 'category',
      label: 'Module 8: Capstone: The Autonomous Humanoid',
      items: [
        'module-8/capstone-intro',
        'module-8/voice-command-workflow',
        'module-8/navigation-detection',
        'module-8/manipulation-task'
      ],
    }
  ],
};

module.exports = sidebars;