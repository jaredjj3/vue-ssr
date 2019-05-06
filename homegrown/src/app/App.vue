<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li><router-link to="/foo">foo</router-link></li>
          <li><router-link to="/bar">bar</router-link></li>
          <li><router-link to="/baz">baz</router-link></li>
        </ul>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>
