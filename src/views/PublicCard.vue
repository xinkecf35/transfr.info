<template>
  <div id="card">
    <div
      id="card-info"
      class="level-1"
    >
      <p>Now preparing to download contact information for</p>
      <h2>{{ name }}</h2>
      <p>If download does not start automatically start click</p>
      <a
        id="card-download"
        href="#card-download"
        @click.prevent="manualDownload()"
      >
        here.
      </a>
    </div>
  </div>
</template>
<script>
import {ajaxRequest, isEmptyOrNull} from '@/functions';
import {baseURL, complexAttributes} from '@/global-vars';

const VCardFieldMap = {
  address: 'ADR',
  birthday: 'BDAY',
  email: 'EMAIL',
  fullName: 'FN',
  impp: 'IMPP',
  name: 'N',
  nickname: 'NICKNAME',
  note: 'NOTE',
  organization: 'ORG',
  telephone: 'TEL',
};

export default {
  name: 'PublicCard',
  beforeRouteEnter(to, from, next) {
    // Fetch Data if appropriate
    const cardId = to.params.card;
    const cardDataURL = `${baseURL}/card/${cardId}`;
    const cardDataPromise = ajaxRequest('GET', cardDataURL);
    cardDataPromise.then((response) => {
      next((vm) => vm.createVCard(response.card));
    }).catch(function(err) {
      if (err.status === 404) {
        next((vm) => vm.notFound = true);
      }
      next(err);
    });
  },
  props: {
    notFound: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      name: '',
      data: '',
    };
  },
  methods: {
    createVCard(cardJSON) {
      this.name = cardJSON.fullName || '';
      const data = this.convertJSONtoVCard(cardJSON);
      // creating file with Blob constructor, subject to change
      const vCardBlob = new Blob([data], {type: 'text/vcard'});
      this.data = data;
      // add create a tag and automatically click it to start download
      const element = document.createElement('a');
      element.href = window.URL.createObjectURL(vCardBlob);
      element.download = 'transfr.vcf';
      document.body.appendChild(element);
      window.setTimeout(() => element.click(), 2000);
      document.body.removeChild(element);
    },
    convertJSONtoVCard(cardJSON) {
      // Prefix data with VCard identifier and Product ID
      let vCardData = 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
      vCardData += 'PRODID:-//transfr.info//Web Client\r\n';
      // Process JSON attributes into VCard format
      let JSONFields = Object.keys(cardJSON);
      JSONFields = JSONFields.filter((key) => key !== 'description');
      const simpleKeys =
        JSONFields.filter((key) => complexAttributes.indexOf(key) === -1);
      const multipleKeys =
        JSONFields.filter((key) => complexAttributes.indexOf(key) > -1);
      simpleKeys.forEach(function(key) {
        const field = VCardFieldMap[key];
        vCardData += field + ':' + cardJSON[key] + '\r\n';
      });
      multipleKeys.forEach(function(key) {
        const field = VCardFieldMap[key];
        const values = cardJSON[key];
        values.forEach(function(value) {
          const formattedString =
            ['TYPE=', value.type, ':', value.value].join('');
          vCardData += field + ';' + formattedString + '\r\n';
        });
      });
      // End Data with VCard terminator
      vCardData += 'END:VCARD\r\n';
      return vCardData;
    },
    // What was I thining?
    // probably an alternative to Blob?
    manualDownload() {
      const cardId = this.$router.currentRoute.params.card;
      if (!isEmptyOrNull(this.data)) {
        const cardDataURL = `${baseURL}/card/${cardId}`;
        const dataPromise = ajaxRequest('GET', cardDataURL);
        dataPromise
          .then((response) => this.convertJSONtoVCard(response.card))
          .then((vcard) => this.data = vcard)
          .then(() => this.createVCard)
          .catch((err) => this.$emit('error/api-fetch', err));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #card {
    background-color: $secondarycolor;
  }
  #card-info {
    position: absolute;
    border-radius: 12px;
    left:50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-height: 10rem;
    @media #{$breakpoint-sm} {
        width: 95%;
    }
    @media #{$breakpoint-md} {
        width: 55%;
    }
    @media #{$breakpoint-lg} {
        width: 40%;
    }
  }

</style>
