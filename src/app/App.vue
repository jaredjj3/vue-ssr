<template>
  <div id="app">
    <header>
      <h1>Vue SSR Test</h1>
      <p>
        The goal of this test is to successfully render the root <code>App</code>
        component and the use <code>vue-router</code> to determine which page
        to render.
      </p>
      <nav>
        <ul>
          <li><router-link to="/foo">foo</router-link></li>
          <li><router-link to="/bar">bar</router-link></li>
          <li><router-link to="/baz">baz</router-link></li>
        </ul>
      </nav>
    </header>
    <hr/>
    <router-view></router-view>
  </div>
</template>
