let accounts = [];

const fakeAccount = { host: 'fake-host', user: 'fake-user', path: 'fake-path' };

try {
  /* eslint-disable global-require */
  accounts = require('../accounts');
} catch (e) {
  accounts = [
    fakeAccount,
    fakeAccount,
    fakeAccount,
    fakeAccount,
    fakeAccount,
    fakeAccount,
    fakeAccount,
    fakeAccount,
  ];
}

export default [
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[0].host,
      username: accounts[0].user,
      password: accounts[0].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[1].host,
      username: accounts[1].user,
      password: accounts[1].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[2].host,
      username: accounts[2].user,
      password: accounts[2].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[3].host,
      username: accounts[3].user,
      password: accounts[3].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[4].host,
      username: accounts[4].user,
      password: accounts[4].pass,
    },
  },
  {
    ignoreErrors: true,
    sshConfig: {
      host: accounts[5].host,
      username: accounts[5].user,
      password: accounts[5].pass,
    },
  },
];
