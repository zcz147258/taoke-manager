<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:53
-->
<script>
export default {
  name: 'AuthRedirect',
  created() {
    const hash = window.location.search.slice(1)
    console.log(window.location.search)
    if (window.localStorage) {
      window.localStorage.setItem('x-admin-oauth-code', hash)
      window.close()
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
