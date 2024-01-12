<script setup>
import { ref } from "vue";

const todoItems = ref([
  {
    id: 1,
    title: "Complete SMILE IT Solutions Challenge",
    completed: false,
  },
  {
    id: 2,
    title: "Fix The Bug",
    completed: false,
  },
  {
    id: 3,
    title: "Test The App",
    completed: false,
  },
]);

const deleteToDoAt = (index) => {
  todoItems.value.splice(index, 1);
};

const addTodo = (event) => {
  const title = event.target.value;
  if (title) {
    todoItems.value.push({
      id: todoItems.value.length + 1,
      title,
      completed: false,
    });
    event.target.value = "";
  }
};
</script>
<template>
  <div class="min-h-screen w-screen bg-[#f79548] flex justify-center items-center flex-col gap-4">
    <div class="font-black text-white text-5xl mb-8">TO-DOs</div>
    <div class="flex flex-col gap-4 w-full max-w-lg">
      <TransitionGroup name="list">
        <div
          v-for="(todoItem, todoItemIndex) in todoItems"
          :key="todoItem.id"
          class="bg-white rounded-lg px-6 py-3 text-gray-700 font-medium text-sm flex gap-2 items-center"
        >
          <input v-model="todoItem.completed" type="checkbox" />
          <span class="mr-8">
            {{ todoItem.title }}
          </span>
          <div class="text-red-600 cursor-pointer ml-auto" @click="deleteToDoAt(todoItemIndex)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 50 50"
            >
              <path
                d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
              ></path>
            </svg>
          </div>
        </div>
      </TransitionGroup>
      <input
        type="text"
        placeholder="Press enter to add new todo"
        class="rounded-md border-0 outline-none w-full max-w-lg px-6 py-3"
        @keypress.enter="addTodo"
      />
    </div>
  </div>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<!-- 
  at first, it wasn't clear what was causing the issue
  but after i made sure the transition styles were ok, i checked the looped element and saw that index was used for the key
  that hinted a clear indication that transition was failing because of keys getting updated when removing todos
-->

<!--
  my thoughts:

  if this was build with react, i'd have probably used `@formkit/auto-animate`.
  its mind blowing for me that something as complex as the TransitionGroup is part of the vue built-ins

  its a good balance between nice looking code and not being black magicy
-->
