const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const generateServerId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export { generateUserId, generateServerId };
