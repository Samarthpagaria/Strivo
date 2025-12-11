// Common topics to ensure search result overlap between videos and tweets
const TOPICS = [
  {
    tag: "React",
    videos: [
      "Building a Full Stack App in 10 Minutes with React",
      "React vs Vue vs Angular - 2024 Edition",
      "React Server Components Explained",
      "Mastering React Hooks",
      "Next.js 14 Tutorial for Beginners",
    ],
    tweets: [
      "Just learned about React Server Components. Mind blown! 🤯 #ReactJS",
      "Why is useEffect so confusing sometimes? 😅 #React",
      "Building my new portfolio with Next.js and Tailwind. It's blazing fast! 🚀",
      "React 19 features look promising. Can't wait to try them out.",
      "Is Create React App dead? What are you using for new projects? Vite?",
    ],
  },
  {
    tag: "JavaScript",
    videos: [
      "Understanding JavaScript Closures",
      "JavaScript Event Loop Visualized",
      "ES6+ Features You Should Know",
      "Async/Await vs Promises",
      "The Weird Parts of JavaScript",
    ],
    tweets: [
      "JavaScript is the only language where [] + [] = '' but {} + [] = 0. 😂 #JustJSThings",
      "Finally understood closures today. It just clicked! 💡",
      "Console.log is my debugger. Don't judge me. 🐛",
      "Typescript saved my life today. Interface mismatch caught at compile time! 🙌",
      "Anyone else love the new array methods in JS?",
    ],
  },
  {
    tag: "AI",
    videos: [
      "The Future of AI is Here",
      "Machine Learning Basics for Devs",
      "Building a Chatbot with OpenAI API",
      "Deep Learning vs Neural Networks",
      "Will AI Replace Programmers?",
    ],
    tweets: [
      "Artificial Intelligence will not replace developers, but developers who use AI will replace those who don't.",
      "Just had a conversation with ChatGPT that felt too real. 🤖",
      "Exploring local LLMs with LLaMA. The speed is incredible!",
      "Copilot is scary good at predicting what I'm about to type.",
      "The ethics of AI art generation needs more discussion. 🎨",
    ],
  },
  {
    tag: "Design",
    videos: [
      "Design Systems 101",
      "Figma Masterclass 2024",
      "UI/UX Trends for the Next Decade",
      "Color Theory for Developers",
      "Typography Crimes You're Committing",
    ],
    tweets: [
      "Beautiful color palette for your next project 🎨 #FF6B6B - Coral Red, #4ECDC4 - Turquoise.",
      "Simplicity is the soul of massive efficiency in design.",
      "Dark mode should be mandatory for all apps. My eyes thank you. 🌑",
      "Figma's new update is a game changer for collaboration.",
      "White space is not empty space. It's an active design element.",
    ],
  },
  {
    tag: "Python",
    videos: [
      "Python for Data Science",
      "Automating Boring Stuff with Python",
      "Django vs Flask: Web Framework Battle",
      "Intro to Pandas and NumPy",
      "Python 3.12: What's New?",
    ],
    tweets: [
      "Python is such a versatile language. From web dev to data science, it does it all. 🐍",
      "List comprehensions in Python are sheer elegant beauty.",
      "Pandas is slow until you vectorize your operations. Then it flies! 🚀",
      "Just wrote my first web scraper. The internet is my dataset now.",
      "Indentation errors are the worst part of Python. Change my mind.",
    ],
  },
  {
    tag: "Gaming",
    videos: [
      "Elden Ring: Shadow of the Erdtree Review",
      "Speedrunning Minecraft in Under 10 Minutes",
      "The History of Super Mario",
      "Unity Game Development for Beginners",
      "Unreal Engine 5 Graphics Showcase",
    ],
    tweets: [
      "Just beat the final boss in Elden Ring! My hands are shaking. 🎮",
      "Who's up for some Valorant tonight? Need a 5th player.",
      "The graphics in the new GTA 6 trailer look unreal. 🤯",
      "Indie games are carrying the industry right now. So much creativity!",
      "Steam Summer Sale is hurting my wallet again. 💸",
    ],
  },
  {
    tag: "Lifestyle",
    videos: [
      "My Morning Routine as a Software Engineer",
      "Travel Vlog: exploring Tokyo",
      "10 Minute Home Workout",
      "Healthy Meal Prep for Busy Week",
      "Digital Nomad Life in Bali",
    ],
    tweets: [
      "Coffee + Code = ❤️ Currently debugging a tricky issue on a Sunday.",
      "Traveling while working remotely is the dream. Hello from Bali! ✈️💻",
      "Remember to touch grass today. Your mental health matters. 🌳",
      "Meal prepping on Sundays saves so much time during the week.",
      "Just signed up for a half marathon. Wish me luck! 🏃‍♂️",
    ],
  },
  {
    tag: "Career",
    videos: [
      "How to land a Tech Job in 2024",
      "System Design Interview Prep",
      "Resume Review: Common Mistakes",
      "Negotiating Your Salary",
      "Day in the Life at Google",
    ],
    tweets: [
      "Imposter syndrome is real, but remember how far you've come.",
      "Networking is key. Your next job might come from a casual DM.",
      "Just got the offer! Senior Frontend Engineer at my dream company. 😭🎉",
      "Interviews are broken. Leetcode doesn't measure engineering skill.",
      "Always negotiate your salary. You are worth more than you think.",
    ],
  },
  // Add generic fillers to reach the count
  ...Array.from({ length: 15 }, (_, i) => ({
    tag: "General",
    videos: [
      `Vlog #${i + 1}: Daily Updates`,
      ` Tech Review: Product ${i + 100}`,
      `Coding Challenge #${i + 1}`,
      `Podcast Episode ${i + 50}`,
    ],
    tweets: [
      `Just another day in paradise. ☀️`,
      `Working on something cool. Can't wait to share!`,
      `Is it Friday yet? 😴`,
      `Does anyone have a recommendation for a good ${
        ["monitor", "chair", "keyboard", "mouse"][i % 4]
      }?`,
    ],
  })),
];

// Helper to generate data from topics
const generateData = () => {
  let videos = [];
  let tweets = [];
  let videoIdCounter = 1;
  let tweetIdCounter = 1;

  TOPICS.forEach((topic) => {
    // Add videos for this topic
    if (topic.videos) {
      topic.videos.forEach((title) => {
        videos.push({
          _id: `${videoIdCounter++}`,
          title: title,
          thumbnail: `https://picsum.photos/seed/v${videoIdCounter}/600/400`,
          description: `Learn more about ${topic.tag}. This video covers advanced concepts and practical examples related to ${title}. Watch now for in-depth analysis.`,
          channel: `${topic.tag} Central`,
          views: `${Math.floor(Math.random() * 900) + 5}K`,
          uploaded: `${Math.floor(Math.random() * 11) + 1} months ago`,
          duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(
            Math.random() * 59
          )
            .toString()
            .padStart(2, "0")}`,
          avatar: `https://picsum.photos/seed/ch${videoIdCounter}/100/100`,
          isVerified: Math.random() > 0.4,
        });
      });
    }

    // Add tweets for this topic
    if (topic.tweets) {
      topic.tweets.forEach((content) => {
        tweets.push({
          id: `${tweetIdCounter++}`,
          username: `${topic.tag} Fan`,
          handle: `@${topic.tag.toLowerCase()}_lover_${tweetIdCounter}`,
          timestamp: `${Math.floor(Math.random() * 23) + 1}h`,
          content: content,
          avatar: `https://picsum.photos/seed/u${tweetIdCounter}/48/48`,
          replies: Math.floor(Math.random() * 50),
          retweets: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 500),
        });
      });
    }
  });

  // Shuffle arrays to mix topics up, making the feed look natural
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  return {
    videos: shuffle(videos),
    tweets: shuffle(tweets),
  };
};

const data = generateData();

export const MOCK_VIDEOS = data.videos;
export const MOCK_TWEETS = data.tweets;
