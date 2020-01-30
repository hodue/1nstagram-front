export const defaults = {
  isLoggedIn: Boolean(localStorage.getItem("token")) || false
}

export const resolvers = {
  Mutation: {
    logUserIn: (_, { token }, {cache }) => {
      alert('로그인!!!')
      localStorage.setItem("token", token);
      cache.writeData({
        data: {
          isLoggedIn: true
        }
      })
      window.location = "/";
      return null;
    },
    logUserOut: (_,__, { cache }) => {
      alert('로그아웃')
      localStorage.removeItem("token");
      window.location = "/";
      return null;
    }
  }
};