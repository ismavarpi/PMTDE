const changelogApi = {
  list: async (offset = 0) => {
    const res = await fetch(`/api/changelog?offset=${offset}`);
    return res.json();
  },
};
