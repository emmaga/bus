<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  body{
  	color: rgb(41,41,41);
  	background: rgb(245,245,245)
  }
 .card {
    border: solid 1px rgb(233,233,233);
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    background: rgb(255,255,255)
  }
  .card h1{
    margin: 0;
    font-size: 1.5rem;
    font-weight: normal
  }
  .card h2{
    margin: 0;
    font-size: 1rem;
    font-weight: normal
  }
  .card p{
    margin: 0;
  }
  .card-title{
    padding: 1rem;
    border-bottom: solid 1px rgb(233,233,233);
  }

  .card-body{
   padding: 1rem; 
  }

  .card-footer{
    border-top: solid 1px rgb(233,233,233);
    padding: 1rem
  }

  .div-image{
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
  }

  .high-light{
    font-size: 1.25em;
    color: rgb(230,140,40)
  }
</style>
