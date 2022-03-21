<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h3>Feedback, feature requests and bug reports</h3>
      </div>
    </div>
    <form @submit.prevent="submit" class="needs-validation">

      <div class="mb-3 row">
        <label :class="{'is-invalid': typeInvalid}" for="type" class="text-start col-sm-2 col-form-label">Type of
          feedback</label>
        <div class="col-sm-10">
          <select v-model="type" :class="{'is-invalid': typeInvalid}" id="type" class="form-select"
                  aria-label="Type of feedback">
            <option selected disabled>Please select type</option>
            <option value="feedback">Feedback</option>
            <option value="feature">Feature request</option>
            <option value="bug">Bug report</option>
          </select>
        </div>
      </div>

      <div class="mb-3 row">
        <label :class="{'is-invalid': titleInvalid}" for="title"
               class="text-start col-sm-2 col-form-label">Title</label>
        <div class="col-sm-10">
          <input v-model.trim="title" :class="{'is-invalid': titleInvalid}" type="text" class="form-control" id="title"
                 placeholder="Title of message" required>
        </div>
      </div>

      <div class="mb-3 row">
        <label for="description" class="text-start col-sm-2 col-form-label">Message</label>
        <div class="col-sm-10">
          <textarea v-model="desc" class="form-control" id="description" rows="5" placeholder="Message"></textarea>
        </div>
      </div>

      <div class="mb-3 row">
        <label for="address" class="text-start col-sm-2 col-form-label">Account Address</label>
        <div class="col-sm-10">
          <input v-model="address" type="text" class="form-control" id="address"
                 placeholder="Optional account address to recreate error">
        </div>
      </div>
      <hr/>
      <p class="text-start">If you want me to be able to get back to you, consider providing at least one of these
        fields.</p>
      <div class="mb-3 row">
        <label for="discord" class="text-start col-sm-2 col-form-label">Discord handle</label>
        <div class="col-sm-10">
          <input :class="{'is-invalid': senderInvalid}" v-model="discord" type="text" class="form-control" id="discord" placeholder="Optional Discord handle">
        </div>
      </div>
      <div class="mb-3 row">
        <label for="email" class="text-start col-sm-2 col-form-label">Email address</label>
        <div class="col-sm-10">
          <input :class="{'is-invalid': senderInvalid}" v-model="email" type="email" class="form-control" id="email" placeholder="Optional email address">
        </div>
      </div>

      <div class="mb-3 row">
        <button class="col-sm-2 col-form-label">
          <template v-if="!sending">Send</template>
          <template v-if="sending">Sending..</template>
        </button>
        <div class="col-sm-10">
          <p v-if="error.length >0" class="text-warning bg-dark">{{ error }}</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "Feedback",
  data() {
    return {
      type: "",
      title: "",
      desc: "",
      address: "",
      discord: "",
      email: "",
      typeInvalid: false,
      titleInvalid: false,
      senderInvalid: false,
      sending: false,
      error: ""
    }
  },
  methods: {
    submit() {
      if (!this.sending && this.checkValidity()) {
        this.sending = true
        const body = JSON.stringify({
          title: this.title,
          desc: this.desc,
          type: this.type,
          address: this.address,
          discord: this.discord,
          email: this.email
        })

        const config = {
          headers: {
            'Content-Type': "application/json"
          }
        }

        console.log(body)
        axios.post("https://us-east1-dfkwatch-328521.cloudfunctions.net/relayReport", body, config)
            .then(response => {
              console.log(response)
              if (response.status === 200) {
                this.error = ""
                this.$gtag.event("SubmitFeedback", {
                  'event_category': 'Feedback',
                  'evet_label': 'Submit',
                  'value': this.type
                })
                this.$router.push(`/thankYouForTheFeedback`)
              } else {
                console.log(`Gor error ${response.status} from server`)
                this.error = `Sorry! Got an error while sending your message!`
              }
            })
            .catch(err => {
              console.log(err)
              this.error = `Sorry! Got an exception while sending your message!`
            })

      } else if (this.sending) {
        this.error = `Already sending..`
      }else {
        this.error = `Sorry one of the required fields has an error. You need to put something in either Discord handle or Email address (doesn't need to be true).`
        console.log(`INVALID TYPE: ${this.type} TITLE: ${this.title} DESC: ${this.desc} A: ${this.address} D: ${this.discord} E: ${this.email}`)
      }
      this.sending = false
    },
    checkValidity() {
      this.typeInvalid = this.type.length < 3
      this.titleInvalid = this.title.length < 3

      this.senderInvalid = !this.discord && !this.email


      return !this.typeInvalid && !this.titleInvalid && !this.senderInvalid
    }
  }
}
</script>

<style scoped>

</style>