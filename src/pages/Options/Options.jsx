import React, { Component } from 'react';
import './Options.css';
import { Pie, Bar, HorizontalBar } from 'react-chartjs-2';
import Axios from 'axios';
import ToggleButton from 'react-toggle-button';

class Options extends Component {
  state = {
    dashboardData: null,
    Github: false,
    'Github-Username': '',
    'Github-Password': '',
    Bitbucket: false,
    productivity: '5 hrs',
    nonProductivity: '4 hrs',
    isLoggedIn: null,
    chartData: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          data: [300, 55, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    },
  };

  componentDidMount() {
    chrome.storage.local.get(['id'], (result) => {
      if (result.id) {
        Axios({
          url: 'https://1a2005cb.ngrok.io',
          method: 'post',
          data: {
            query: `
                    query GetChartData {
                      getChartData(userId: "${result.id}") {
                        chartData {
                          datasets {
                            data
                            backgroundColor
                            hoverBackgroundColor
                          }
                          labels
                        }
                        visitedData {
                          datasets {
                            data
                          }
                          labels
                        }
                        timedData {
                          datasets {
                            data
                          }
                          labels
                        }
                      }
                    }
                    `,
          },
        }).then((res) => {
          this.setState({
            chartData: res.data.data.getChartData,
            isLoggedIn: result.id,
            isMounted: true,
          });
        });
        Axios({
          url: 'https://1a2005cb.ngrok.io',
          method: 'post',
          data: {
            query: `
          query GetDashboardData {
            getDashboardData(userId: "${result.id}"){
              work
              hours
            }
          }
          `,
          },
        })
          .then((result) => {
            this.setState({ dashboardData: result.data.data.getDashboardData });
          })
          .catch((err) => console.log('error'));
      } else {
        this.setState({ isMounted: true });
      }
    });
  }

  onGithubLogin = () => {
    Axios({
      url: 'https://1a2005cb.ngrok.io',
      method: 'post',
      data: {
        query: `
                    mutation Addon {
                      addon(name: "${
                        this.state['Github-Username']
                      }", apiKey: "${
          this.state['Github-Username']
        }", userId: "${this.state.isLoggedIn}", secretKey: "${
          this.state['Github-Password']
        }")
                    }
                    `,
      },
    })
      .then((result) => {
        this.setState({ 'Github-Username': '', 'Github-Password': '' });
      })
      .catch((err) => console.log('error'));
  };

  onLogout = () => {
    chrome.storage.local.remove(['id', 'userName', 'profilePic'], () => {
      this.setState({ isLoggedIn: null });
    });
  };

  createUser = () => {
    Axios({
      url: 'https://1a2005cb.ngrok.io',
      method: 'post',
      data: {
        query: `
                    mutation CreateUser {
                      createUser(email: "${
                        this.state['app-Email']
                      }", userName: "${
          this.state['app-Email'].split('@')[0]
        }", userToken: "${this.state['app-Password']}") {
          id
          userName
          profilePic
        }
                    }
                    `,
      },
    })
      .then((result) => {
        chrome.storage.local.set(result.data.data.createUser, function() {
          console.log('stored');
        });
        this.setState({
          'app-Email': '',
          'app-Password': '',
          isLoggedIn: result.data.data.createUser.id,
        });
      })
      .catch((err) => console.log('error'));
  };

  render() {
    if (!this.state.isMounted) {
      return (
        <div
          style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
          }}
        >
          Loading...
        </div>
      );
    }

    if (!this.state.isLoggedIn) {
      return (
        <div
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <fieldset>
            <input
              id={`app-Email`}
              placeholder="Email"
              value={this.state[`app-Email`]}
              onChange={(event) => {
                const text = event.target.value;
                this.setState({ [`app-Email`]: text });
              }}
            />
            <input
              id={`app-Password`}
              type="password"
              value={this.state[`app-Password`]}
              onChange={(event) => {
                const text = event.target.value;
                this.setState({ [`app-Password`]: text });
              }}
              style={{
                display: 'none',
              }}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={this.createUser}
              style={{
                backgroundColor: 'red',
                outline: 'none',
                borderRadius: 10,
                border: 'none',
              }}
              className={`oauth`}
            >{`Login`}</button>
          </fieldset>
        </div>
      );
    }

    if (!this.state.chartData) {
      return null;
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '50px auto',
          width: '100%',
          height: '100vh',
        }}
      >
        <div
          style={{
            backgroundColor: '#ededed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 5px 15px -5px rgba(0,0,0,.1)',
            padding: 10,
          }}
        >
          <div
            style={{
              fontSize: 25,
              marginBottom: 5,
              color: '#333333',
            }}
          >
            Earnest Stats
          </div>
          <div
            style={{
              fontSize: 15,
              marginBottom: 5,
              color: '#333333',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={this.onLogout}
          >
            Logout
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 25vw',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateRows: '60vh auto',
              width: '100%',
              height: '100%',
              paddingTop: 100,
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '60vh',
                width: '90%',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '90%',
                  margin: '0 auto',
                }}
              >
                <Pie
                  options={{
                    legend: {
                      display: true,
                      position: 'right',
                    },
                  }}
                  data={this.state.chartData.chartData}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingTop: 100,
              }}
            >
              <div style={{ height: 'auto', width: '40%' }}>
                <Bar
                  options={{
                    legend: {
                      display: false,
                    },
                  }}
                  data={this.state.chartData.visitedData}
                />
              </div>
              <div style={{ height: 'auto', width: '40%' }}>
                <HorizontalBar
                  options={{
                    legend: {
                      display: false,
                    },
                  }}
                  data={this.state.chartData.timedData}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '100%',
              paddingTop: 50,
            }}
          >
            {this.state.dashboardData ? (
              <div style={{ marginBottom: 50 }}>
                <div
                  style={{
                    fontSize: 25,
                    marginBottom: '1rem',
                    color: '#333333',
                  }}
                >
                  Summary
                </div>
                {this.state.dashboardData.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 5px 15px -5px rgba(0,0,0,.1)',
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        color: '#333333',
                      }}
                    >
                      {item.work}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#333333',
                      }}
                    >
                      {item.hours}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div>
              <div
                style={{
                  fontSize: 25,
                  marginBottom: '1rem',
                  color: '#333333',
                }}
              >
                Integrations
              </div>
              {['Github', 'Bitbucket'].map((item) => (
                <div
                  key={item}
                  style={{
                    boxShadow: '0 5px 15px -5px rgba(0,0,0,.1)',
                    padding: 10,
                    WebkitTransition: 'width 2s, height 4s',
                    transition: ' width 2s, height 4s',
                    height: this.state[item] ? '200px' : 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        color: '#333333',
                      }}
                    >
                      {`Enable ${item} Integration`}
                    </div>
                    <ToggleButton
                      value={this.state[item]}
                      colors={{
                        active: {
                          base: item === 'Github' ? '#333333' : '#2684ff',
                        },
                      }}
                      onToggle={(value) => {
                        this.setState({
                          [item]: !value,
                        });
                      }}
                    />
                  </div>
                  {this.state[item] ? (
                    <div
                      style={{
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <fieldset>
                        <input
                          id={`${item}-Username`}
                          placeholder="Github username"
                          value={this.state[`${item}-Username`]}
                          onChange={(event) => {
                            const text = event.target.value;
                            this.setState({ [`${item}-Username`]: text });
                          }}
                        />
                        <input
                          id={`${item}-Password`}
                          type="password"
                          value={this.state[`${item}-Password`]}
                          onChange={(event) => {
                            const text = event.target.value;
                            this.setState({ [`${item}-Password`]: text });
                          }}
                          placeholder="Github password"
                        />
                        <button
                          type="button"
                          onClick={this.onGithubLogin}
                          className={`oauth ${item}`}
                        >{`Login with ${item}`}</button>
                      </fieldset>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Options;

const data = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [300, 55, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
};
