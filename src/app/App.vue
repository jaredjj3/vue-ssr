<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">home</router-link>
        <router-link to="/foo">foo</router-link>
        <router-link to="/bar">bar</router-link>
        <router-link to="/baz">baz</router-link>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>
