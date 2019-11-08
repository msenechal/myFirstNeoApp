<template>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
        <form class="login100-form validate-form"><img src="@/assets/neo4j_logo.svg" />
					<span class="login100-form-title p-b-33">
						Database Login
					</span>

          <div class="wrap-input100 validate-input" data-validate = "a valid protocol://host:port is required: ex@abc.xyz">
            <input class="input100 wrap-input100" type="text" name="Protocol" placeholder="Protocol" value="bolt" v-model="protocol">
            <input class="input100 wrap-input100" type="text" name="Host" placeholder="Host" value="localhost" v-model="host">
            <input class="input100 wrap-input100" type="text" name="Port" placeholder="Port" value="11009" v-model="port">
            <span class="focus-input100-1"></span>
            <span class="focus-input100-2"></span>
          </div>

          <div class="wrap-input100 rs1 validate-input" data-validate="Username is required">
            <input class="input100" type="text" name="Username" placeholder="Username"  value="neo4j" v-model="username">
            <span class="focus-input100-1"></span>
            <span class="focus-input100-2"></span>
          </div>

          <div class="wrap-input100 rs1 validate-input" data-validate="Password is required">
            <input class="input100" type="password" name="Password" placeholder="Password" v-model="password">
            <span class="focus-input100-1"></span>
            <span class="focus-input100-2"></span>
          </div>

          <div class="container-login100-form-btn m-t-20">
            <button type="button" class="login100-form-btn" @click="NeoConnect()">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../router'

  export default {
    name: 'Login',
    data() {
      return {
        protocol: 'bolt',
        host: 'localhost',
        port: 11002,
        username: 'neo4j',
        password: ''
      }
    },
    methods: {
      NeoConnect: function () {
        this.$neo4j.connect(this.protocol, this.host, this.port, this.username, this.password);
        this.$neo4j.getDriver()

        const session = this.$neo4j.getSession()

        try {
          session.run('MATCH (n) RETURN count(n) AS count')
                  .then(res => {
                    localStorage.setItem("neo4jsession",this.session);
                    localStorage.setItem("neo4j-protocol",this.protocol);
                    localStorage.setItem("neo4j-host",this.host);
                    localStorage.setItem("neo4j-port",this.port);
                    localStorage.setItem("neo4j-username",this.username);
                    localStorage.setItem("neo4j-password",this.password);
                    router.push({ name: 'neo4j'})
                  })
                  .then(() => {
                    session.close()
                  })
        } catch (e) {
          /* eslint-disable-next-line no-console */
          console.log("error")
          localStorage.removeItem("neo4jsession")
          router.push({ name: 'home'})
        }
      }
    }
  }
</script>