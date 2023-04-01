<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref } from 'vue'
import Logger from 'js-logger'

library.add(faPencil)

const logger = Logger.get('Navbar.vue')
const navbarBurger = ref<HTMLAnchorElement | null>(null)
const navbarMenu = ref<HTMLDivElement | null>(null)

function initializeComponent() {
  initializeNavbarBurger()
}

function initializeNavbarBurger() {
  let burger = navbarBurger.value
  let menu = navbarMenu.value
  if (!burger || !menu) {
    logger.error('Navbar burger or navbar menu element is not present!')
    return
  }

  burger.addEventListener('click', () => {
    burger?.classList.toggle('is-active')
    menu?.classList.toggle('is-active')
  })
}

onMounted(initializeComponent)
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item is-size-4 has-text-weight-bold">
        Whiteboard <font-awesome-icon icon="fa-solid fa-pencil" class="ml-2" />
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        ref="navbarBurger"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" ref="navbarMenu">
      <div class="navbar-start">
        <a class="navbar-item"> Boards </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light"> Log in </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
