import { useEffect, useState } from "react";

type Prop = {
  isOpen: boolean;
};

const Menu = ({ isOpen }: Prop) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  const [username, setUsername] = useState("");

  // Load username from localStorage on first render
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Save username to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("username", username);
    window.dispatchEvent(new Event("username-changed"));
  }, [username]);

  if (!shouldRender) return null;
  return (
    <div
      className={
        (isOpen ? "animate-slide-in-left" : "animate-slide-out-left") +
        " bg-text-dark w-[25%] p-1"
      }
      onAnimationEnd={handleAnimationEnd}
    >
      <h1>Settings</h1>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Menu;
