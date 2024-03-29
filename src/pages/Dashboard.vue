<template>
  <div class="dashboard">
    <div class="dashboard__block-wrapper">
      <div class="dashboard__block dashboard__block-user">
        <div class="dashboard__block-header">
          <div class="dashboard__block-titles">
            <h2 class="dashboard__block-subtitle">Total Shipments</h2>
            <h1 class="dashboard__block-title">Статистика пользователей</h1>
          </div>
          <div class="dashboard__block-header-btns">
            <button
              class="dashboard__block-header-btn"
              :class="{ 'is-active': isActiveUsers === 1 }"
              @click="onClickUsers(1)"
            >
              Аккаунты
            </button>
            <button
              class="dashboard__block-header-btn"
              :class="{ 'is-active': isActiveUsers === 2 }"
              @click="onClickUsers(2)"
            >
              Охват
            </button>
          </div>
        </div>
        <LineChart
          class="dashboard-users"
          :data="dataUsers"
          :options="optionsUsers"
        ></LineChart>
      </div>

      <div class="dashboard__block dashboard__block-info info-1">
        <div class="dashboard__info-head">
          <div class="dashboard__info-icon-wrap">
            <i-tabler:message-circle-2 class="dashboard__info-icon" />
          </div>
          <div class="dashboard__info-data">
            <div class="dashboard__info-data-title">Number</div>
            <div class="dashboard__info-data-value">150GB</div>
          </div>
        </div>
        <div class="dashboard__info-footer">
          <button class="dashboard__info-btn">
            <i-ic:round-update class="dashboard__info-btn-icon" />
            <span>Update Now</span>
          </button>
        </div>
      </div>
      <div class="dashboard__block dashboard__block-info info-2">
        <div class="dashboard__info-head">
          <div class="dashboard__info-icon-wrap">
            <i-tabler:star class="dashboard__info-icon" />
          </div>
          <div class="dashboard__info-data">
            <div class="dashboard__info-data-title">Followers</div>
            <div class="dashboard__info-data-value">+45K</div>
          </div>
        </div>
        <div class="dashboard__info-footer">
          <button class="dashboard__info-btn">
            <i-gravity-ui:pulse class="dashboard__info-btn-icon" />
            <span>Last Research</span>
          </button>
        </div>
      </div>
      <div class="dashboard__block dashboard__block-info info-3">
        <div class="dashboard__info-head">
          <div class="dashboard__info-icon-wrap">
            <i-f7:person-alt-circle class="dashboard__info-icon" />
          </div>
          <div class="dashboard__info-data">
            <div class="dashboard__info-data-title">Users</div>
            <div class="dashboard__info-data-value">150,000</div>
          </div>
        </div>
        <div class="dashboard__info-footer">
          <button class="dashboard__info-btn">
            <i-solar:cup-outline class="dashboard__info-btn-icon" />
            <span>Customer feedback</span>
          </button>
        </div>
      </div>

      <div class="dashboard__block dashboard__block-country">
        <h2 class="dashboard__block-subtitle">Total Shipments</h2>
        <div class="dashboard__block-head">
          <i-solar:bell-outline
            class="dashboard__block-head-icon dashboard-country-icon"
          />
          <p class="dashboard__block-head-text">763,215</p>
        </div>
        <DoughnutChart
          class="dashboard-country"
          :data="dataCountry"
          :options="optionsCountry"
        ></DoughnutChart>
      </div>

      <div class="dashboard__block dashboard__block-posts">
        <h2 class="dashboard__block-subtitle">Completed Tasks</h2>
        <div class="dashboard__block-head">
          <i-tabler:send class="dashboard__block-head-icon dashboard-posts-icon" />
          <p class="dashboard__block-head-text">12,100K</p>
        </div>
        <RadarChart
          class="dashboard-posts"
          :data="dataPosts"
          :options="optionsPosts"
        ></RadarChart>
      </div>

      <div class="dashboard__block dashboard__block-sales">
        <div class="dashboard__block-header">
          <div class="dashboard__block-titles">
            <h2 class="dashboard__block-subtitle">Total Shipments</h2>
            <h1 class="dashboard__block-title">Performance</h1>
          </div>
          <div class="dashboard__block-header-btns">
            <button
              class="dashboard__block-header-btn"
              :class="{ 'is-active': isActiveSales === 1 }"
              @click="onClickSales(1)"
            >
              Прибыль
            </button>
            <button
              class="dashboard__block-header-btn"
              :class="{ 'is-active': isActiveSales === 2 }"
              @click="onClickSales(2)"
            >
              Затраты
            </button>
          </div>
        </div>
        <BarChart
          class="dashboard-sales"
          :data="dataSales"
          :options="optionsSales"
        ></BarChart>
      </div>

      <div class="dashboard__block dashboard__block-errors">
        <h2 class="dashboard__block-subtitle">Daily Sales</h2>
        <h1 class="dashboard__block-title">Ошибки</h1>
        <PolarAreaChart
          class="dashboard-errors"
          :data="dataErrors"
          :options="optionsErrors"
        ></PolarAreaChart>
      </div>

      <div class="dashboard__block dashboard__block-lang">
        <h2 class="dashboard__block-subtitle">Completed Tasks</h2>
        <h1 class="dashboard__block-title">Фреймворки</h1>
        <PieChart
          class="dashboard-lang"
          :data="dataLang"
          :options="optionsLang"
        ></PieChart>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isActiveUsers = ref(1);
const isActiveSales = ref(1);
const usersCount = ref([10, 20, 30, 20, 40, 10, 30, 20, 40, 25, 10, 35]);
const salesCount = ref([400, 200, 120, 500, 100, 250, 400, 50, 350, 280, 480, 150]);
const updateDataUsers = (value) => {
  dataUsers.value = {
    labels: [
      "Янв",
      "Фев",
      "Март",
      "Апр",
      "Май",
      "Ин",
      "Ил",
      "Авг",
      "Сент",
      "Окт",
      "Нояб",
      "Дек",
    ],
    datasets: [
      {
        label: "Пользователи",
        fill: "start",
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 320);

          gradient.addColorStop(0, "#10b9817c");
          gradient.addColorStop(0.5, "#10b9817c");
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        // backgroundColor: "rgba(229, 238, 255, 0.9)",
        borderColor: "#10b981",
        tension: 0.5,
        pointBackgroundColor: "#10b981",
        pointHoverRadius: 7,
        pointRadius: 4,
        pointHoverBorderColor: "#0a7552",
        pointHoverBackgroundColor: "#10b981",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        data: value,
      },
    ],
  };
};
const updateDataSales = (value) => {
  dataSales.value = {
    labels: [
      "Янв",
      "Фев",
      "Март",
      "Апр",
      "Май",
      "Ин",
      "Ил",
      "Авг",
      "Сент",
      "Окт",
      "Нояб",
      "Дек",
    ],
    datasets: [
      {
        label: "Продажи",
        backgroundColor: "#404040",
        data: value,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 320);

          gradient.addColorStop(0, "#0893b642");
          gradient.addColorStop(0.5, "#0893b642");
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        borderColor: "#0893b6",
        borderWidth: 1,
        borderRadius: 3,
        hoverBackgroundColor: "#0893b665",
      },
    ],
  };
};

const dataUsers = ref({
  labels: [
    "Янв",
    "Фев",
    "Март",
    "Апр",
    "Май",
    "Ин",
    "Ил",
    "Авг",
    "Сент",
    "Окт",
    "Нояб",
    "Дек",
  ],
  datasets: [
    {
      label: "Пользователи",
      fill: "start",
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 320);

        gradient.addColorStop(0, "#10b9817c");
        gradient.addColorStop(0.5, "#10b9817c");
        gradient.addColorStop(1, "transparent");

        return gradient;
      },
      // backgroundColor: "rgba(229, 238, 255, 0.9)",
      borderColor: "#10b981",
      tension: 0.5,
      pointBackgroundColor: "#10b981",
      pointHoverRadius: 7,
      pointRadius: 4,
      pointHoverBorderColor: "#0a7552",
      pointHoverBackgroundColor: "#10b981",
      pointBorderWidth: 2,
      pointHoverBorderWidth: 2,
      borderWidth: 2,
      data: usersCount.value,
    },
  ],
});

const optionsUsers = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        color: "#54556b",
      },
      ticks: {
        color: "#c0c0c0",
        font: {
          size: 14,
          family: "Montserrat",
          weight: 500,
          lineHeight: 1.5,
        },
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: "#c0c0c0",
        font: {
          size: 14,
          family: "Montserrat",
          weight: 500,
          lineHeight: 1.5,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      intersect: false,
      padding: 10,
      backgroundColor: "#a7a7a77c", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 5,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
        family: "Montserrat",
        weight: 400,
        lineHeight: 1.2,
      },
      bodyAlign: "center",
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 5,
      usePointStyle: "circle",
      borderColor: "#000",
      borderWidth: 1,
    },
  },
};

const dataCountry = {
  labels: ["США", "Россия", "Украина", "Беларусь", "Мексика"],
  datasets: [
    {
      backgroundColor: ["#10b981", "#306df6", "#d945ed", "#ff7e7f", "#d1d07f"],
      data: [20, 10, 40, 50, 30],
      spacing: 5,
      hoverOffset: 20,
      borderWidth: 1,
      hoverBorderWidth: 2,
      borderRadius: 5,
      borderColor: "#000",
    },
  ],
};

const optionsCountry = {
  responsive: false,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#c0c0c0",
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
        padding: 7,
        usePointStyle: true,
        pointStyle: "rectRounded",
        pointStyleWidth: 35,
        useBorderRadius: true,
        borderRadius: 5,
      },
      title: {
        display: true,
        text: "Страны",
        padding: {
          top: 15,
        },
        color: "#fff",
        font: {
          size: 15,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
      },
    },
    tooltip: {
      intersect: false,
      padding: 8,
      backgroundColor: "#c5c5c5b6", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 3,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
        family: "Montserrat",
        weight: 500,
        lineHeight: 1.2,
      },
      bodyAlign: "left",
      boxWidth: 15,
      boxHeight: 15,
      boxPadding: 5,
      borderColor: "#000",
      borderWidth: 1,
      usePointStyle: true,
    },
  },
};

const dataPosts = {
  labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  datasets: [
    {
      label: "Публикация",
      data: [20, 56, 89, 32, 45, 100, 50],
      backgroundColor: "#10b98138",
      borderColor: "#0f835c",
      borderWidth: 1,
      hoverBackgroundColor: "#10b981",
      pointBackgroundColor: "#0f835c",
      pointBorderColor: "#0f835c",
      pointHoverRadius: 5,
    },
    {
      label: "Удаление",
      data: [80, 80, 50, 70, 100, 30, 12],
      backgroundColor: "#10a0b938",
      borderColor: "#000",
      borderWidth: 1,
      hoverBackgroundColor: "#10a0b9",
      pointBackgroundColor: "#0e778a",
      pointHoverRadius: 5,
    },
  ],
};

const optionsPosts = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    r: {
      ticks: {
        color: "#d4d4d4",
        backdropColor: "transparent",
        font: {
          size: 12,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1,
        },
      },
      grid: {
        color: "#54556b",
      },
      angleLines: {
        color: "#54556b",
      },
      pointLabels: {
        color: "#d4d4d4",
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1,
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#c0c0c0",
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
        padding: 7,
        usePointStyle: true,
        pointStyle: "rectRounded",
        pointStyleWidth: 35,
        useBorderRadius: true,
        borderRadius: 5,
      },
      title: {
        display: true,
        text: "Посты",
        padding: {
          // top: 15,
        },
        color: "#fff",
        font: {
          size: 15,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
      },
    },
    tooltip: {
      intersect: false,
      padding: 8,
      backgroundColor: "#c5c5c55d", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 3,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
        family: "Montserrat",
        weight: 500,
        lineHeight: 1.2,
      },
      bodyAlign: "left",
      boxWidth: 15,
      boxHeight: 15,
      boxPadding: 5,
      borderColor: "#000",
      borderWidth: 1,
      usePointStyle: true,
    },
  },
};

const dataSales = ref({
  labels: [
    "Янв",
    "Фев",
    "Март",
    "Апр",
    "Май",
    "Ин",
    "Ил",
    "Авг",
    "Сент",
    "Окт",
    "Нояб",
    "Дек",
  ],
  datasets: [
    {
      label: "Продажи",
      backgroundColor: "#404040",
      data: salesCount.value,
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 320);

        gradient.addColorStop(0, "#0893b642");
        gradient.addColorStop(0.5, "#0893b642");
        gradient.addColorStop(1, "transparent");

        return gradient;
      },
      borderColor: "#0893b6",
      borderWidth: 1,
      borderRadius: 3,
      hoverBackgroundColor: "#0893b665",
    },
  ],
});

const optionsSales = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: "#3d3d55",
      },
      ticks: {
        color: "#c0c0c0",
        font: {
          size: 14,
          family: "Montserrat",
          weight: 500,
          lineHeight: 1,
        },
        padding: 10,
      },
    },
    y: {
      grid: {
        color: "#3d3d55",
      },
      ticks: {
        color: "#c0c0c0",
        font: {
          size: 14,
          family: "Montserrat",
          weight: 500,
          lineHeight: 1,
        },
        padding: 10,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      intersect: false,
      padding: 10,
      backgroundColor: "#a7a7a77c", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 5,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
        family: "Montserrat",
        weight: 400,
        lineHeight: 1.2,
      },
      bodyAlign: "center",
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 5,
      usePointStyle: "circle",
      borderColor: "#000",
      borderWidth: 1,
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return {
            borderColor: "#000",
            backgroundColor: "#0893b6",
          };
        },
      },
    },
  },
};

const dataErrors = {
  labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  datasets: [
    {
      label: "Системные",
      data: [28, 48, 40, 19, 56, 27, 40],
      backgroundColor: "#10b9814d",
      borderColor: "#000",
      borderWidth: 1,
      hoverBackgroundColor: "#10b981",
    },
    {
      label: "Пользовательские",
      data: [65, 59, 90, 81, 96, 55, 100],
      backgroundColor: "#306bf649",
      borderColor: "#000",
      borderWidth: 1,
      hoverBackgroundColor: "#306bf6",
    },
  ],
};

const optionsErrors = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    r: {
      ticks: {
        color: "#d4d4d4",
        backdropColor: "transparent",
        font: {
          size: 12,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1,
        },
      },
      grid: {
        color: "#54556b",
      },
      angleLines: {
        color: "#54556b",
      },
    },
  },
  plugins: {
    legend: {
      // display: false,
      position: "bottom",
      labels: {
        color: "#c0c0c0",
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
        padding: 7,
        usePointStyle: true,
        pointStyle: "rectRounded",
        pointStyleWidth: 35,
        useBorderRadius: true,
        borderRadius: 5,
      },
      title: {
        display: true,
        text: "Ошибки",
        padding: {
          // top: 15,
        },
        color: "#fff",
        font: {
          size: 15,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
      },
    },
    tooltip: {
      intersect: false,
      padding: 8,
      backgroundColor: "#c5c5c55d", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 3,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
        family: "Montserrat",
        weight: 500,
        lineHeight: 1.2,
      },
      bodyAlign: "left",
      boxWidth: 15,
      boxHeight: 15,
      boxPadding: 5,
      borderColor: "#000",
      borderWidth: 1,
      usePointStyle: true,
    },
  },
};

const dataLang = {
  labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
  datasets: [
    {
      backgroundColor: ["#10b981", "#2ec8ce", "#37bd42", "#306df6"],
      data: [40, 20, 80, 10],
      borderColor: "#000",
      borderRadius: 5,
      borderWidth: 1,
      hoverOffset: 10,
      spacing: 1,
    },
  ],
};

const optionsLang = {
  responsive: false,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
    },
  },
  plugins: {
    legend: {
      // display: false,
      position: "bottom",
      labels: {
        color: "#c0c0c0",
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
        padding: 7,
        usePointStyle: true,
        pointStyle: "rectRounded",
        pointStyleWidth: 35,
        useBorderRadius: true,
        borderRadius: 5,
      },
      title: {
        display: true,
        text: "Фреймворки",
        padding: {
          top: 10,
        },
        color: "#fff",
        font: {
          size: 15,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
      },
    },
    tooltip: {
      intersect: false,
      padding: 8,
      backgroundColor: "#c5c5c55d", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 3,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
        family: "Montserrat",
        weight: 500,
        lineHeight: 1.2,
      },
      bodyAlign: "left",
      boxWidth: 15,
      boxHeight: 15,
      boxPadding: 5,
      borderColor: "#000",
      borderWidth: 1,
      usePointStyle: true,
    },
  },
};

const onClickUsers = (id) => {
  isActiveUsers.value = id;
  if (id === 1) {
    usersCount.value = [10, 20, 30, 20, 40, 10, 30, 20, 40, 25, 10, 35];
    updateDataUsers(usersCount.value);
  } else {
    usersCount.value = [35, 10, 25, 40, 20, 30, 10, 20, 18, 25, 35, 40];
    updateDataUsers(usersCount.value);
  }
};

const onClickSales = (id) => {
  isActiveSales.value = id;
  if (id == 1) {
    salesCount.value = [400, 200, 120, 500, 100, 250, 400, 50, 350, 280, 480, 150];
    updateDataSales(salesCount.value);
  } else {
    salesCount.value = [150, 480, 280, 350, 50, 400, 150, 480, 280, 200, 350, 150];
    updateDataSales(salesCount.value);
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  color: #8383839c;
  padding: 30px 0;
  &__block {
    background-color: var(--color-main);
    border-radius: 15px;
    flex: 1;
    &-wrapper {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 15px;
    }
    &-user {
      padding: 20px;
      grid-column-start: 1;
      grid-column-end: 7;
      .dashboard__block-header-btn {
        color: #10b981;
        border-color: #10b981;
      }
      .is-active {
        color: #27283b;
        background: #10b981;
      }
    }
    &-country {
      padding: 15px;
      grid-column-start: 1;
      grid-column-end: 4;
    }
    &-posts {
      padding: 15px;
      grid-column-start: 4;
      grid-column-end: 7;
    }
    &-sales {
      padding: 20px;
      grid-column: span 6;
      .dashboard__block-header-btn {
        color: #1f9cce;
        border-color: #1f9cce;
      }
      .is-active {
        color: #27283b;
        background: #1f9cce;
      }
    }
    &-errors {
      padding: 15px;
      grid-column-start: 1;
      grid-column-end: 4;
    }
    &-lang {
      padding: 15px;
      grid-column-start: 4;
      grid-column-end: 7;
    }
  }

  &__block-title {
    color: var(--color-white);
    font-size: 26px;
    font-weight: 400;
    margin-bottom: 20px;
  }

  &__block-info {
    grid-column: span 2;
    padding: 15px 15px 10px;
    &.info-1 {
      .dashboard__info-icon-wrap {
        background-color: #ff7e7f;
      }
    }
    &.info-2 {
      .dashboard__info-icon-wrap {
        background-color: #d945ed;
      }
    }
    &.info-3 {
      .dashboard__info-icon-wrap {
        background-color: #306df6;
      }
    }
  }

  &__info-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__info-icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__info-icon {
    height: 30px;
    width: 30px;
  }

  &__info-data {
    color: #fff;
    text-align: right;
  }

  &__info-data-title {
    color: #c0c0c0;
    font-size: 12px;
    margin-bottom: 2px;
  }

  &__info-data-value {
    font-size: 19px;
  }

  &__info-footer {
    padding-top: 10px;
    margin-top: 30px;
    border-top: 1px solid #9292929d;
  }

  &__info-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #c0c0c0;
    font-size: 14px;
    &-icon {
      height: 22px;
      width: 22px;
    }
  }
  &__block-subtitle {
    margin-bottom: 5px;
    font-size: 12px;
  }

  &__block-head-icon {
    height: 20px;
    width: 20px;
  }

  &__block-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__block-header-btns {
    display: flex;
  }

  &__block-header-btn {
    font-weight: 600;
    font-size: 12px;
    transition: all 0.3s;
    border: 1px solid;
    padding: 5px 10px;
    &:nth-child(1) {
      border-radius: 5px 0 0 5px;
    }
    &:nth-child(2) {
      border-radius: 0 5px 5px 0;
    }
  }

  &__block-head-text {
    color: #fff;
    font-size: 22px;
    font-weight: 300;
  }
}
.dashboard-users {
  height: 100%;
  width: 100%;
}
.dashboard-sales {
  width: 100%;
}
.dashboard-posts-icon {
  color: #10b981;
}
.dashboard-country {
  height: 100%;
  width: 100%;
  &-icon {
    color: #d945ed;
  }
}
</style>
