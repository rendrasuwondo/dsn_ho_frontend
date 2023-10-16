<template>
    <!-- <div class="sidebar"> -->
      <div class="wrapper">
        <!-- Header -->
        <Header />
  
        <!-- /.Hader -->
  
        <!-- <aside class="main-sidebar sidebar-color elevation-4">
          <div class="title-brand">
            <a to="/erp_ho/main/dashboard" class="brand-link text-center mt-2">
              <span class="brand-text font-weight-bold">ERP - HO</span>
            </a>
          </div>
        </aside> -->
  
        <!-- content -->
        <Nuxt />
        <!-- / .content -->
  
        <footer class="side-footer">
          <div class="float-right d-none d-sm-block"><b>Version</b> 1.0.0</div>
          <strong>Copyright &copy; 2022 ERP HO DSN</strong> All rights reserved.
        </footer>
        <aside class="control-sidebar control-sidebar-dark"></aside>
      </div>
    <!-- </div> -->
  </template>
  
  <script>
  import Header from '@/components/view/header.vue'
//   import Sidebar from '@/components/admin/sidebar.vue'
  
  export default {
    //middleware auth
    // middleware: 'auth',
  
    components: {
      Header,
    //   Sidebar,
    },
  }
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
  
  /* .wrapper,
  .content-wrapper {
    background-color: #000000 !important;
  } */
  
  .WidthAction {
    max-width: 90px;
  }
  
  .brand-link {
    padding-top: 14px;
  }
  /* .sidebar-mini.sidebar-collapse .main-sidebar,
  .sidebar-mini.sidebar-collapse .main-sidebar::before {
    margin-left: 0;
    width: 4.6rem;
  } */
  
  /* .sidebar-color {
    background: linear-gradient(270deg, #3f3568, #504d8d);
  } */
  .title-brand {
    margin-bottom: 10px;
    padding-bottom: 1px;
    border-bottom: 1px solid #aeabf1;
    box-shadow: 0px 2px 2px #5c5696;
  }
  .brand-text {
    color: white;
    font-family: 'Audiowide', cursive;
    font-size: 19px;
  }
  
  .nav-pills .nav-link {
    color: #daceff;
    font-weight: 500;
  }
  .nav-pills .nav-link:not(.active):hover {
    color: rgb(255, 255, 255);
  }
  .side-footer {
    margin-left: 1cm;
    margin-right: 1cm;
    margin-bottom: 2cm;
    color: #a29cb9;
  }
  
  .nav-pills .nav-link.active,
  .nav-pills .show > .nav-link {
    color: #fff;
    background-color: #67b3ff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  }
  </style>
  