// =====================================
// REDUX PERSIST STORAGE
// =====================================

const storage = {
  getItem: (
    key: string
  ): Promise<string | null> => {
    return Promise.resolve(
      localStorage.getItem(key)
    );
  },

  setItem: (
    key: string,
    value: string
  ): Promise<string> => {
    localStorage.setItem(
      key,
      value
    );

    return Promise.resolve(
      value
    );
  },

  removeItem: (
    key: string
  ): Promise<void> => {
    localStorage.removeItem(
      key
    );

    return Promise.resolve();
  },
};

export default storage;