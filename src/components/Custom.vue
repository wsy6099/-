<template>
  <div>
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>导航设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="nav-config-box">
      <!-- 导航库 -->
      <div class="nav-library bd full-1">
        <div class="nav-config-title">导航库</div>

        <div
          v-for="(item, index) of unit"
          :key="`unit-item${index}`"
          class="library-second-box"
        >
          <div class="library-second-title">{{ item.name }}</div>
          <draggable
            class="nav-unit"
            :options="optionsUnit"
            :clone="cloneDog"
            :move="onMove"
            :list="item.children"
            @start="onStart"
            @end="onEnd"
            dragClass="ghostClass"
            chosenClass="ghostClass"
          >
            <transition-group tag="ul">
              <li
                v-for="children in item.children"
                :key="children.name"
                class="nav-unit-item"
                :only="children.only"
              >
                <i class="icon-gedian"></i>
                <span>{{ children.name }}</span>
              </li>
            </transition-group>
          </draggable>
        </div>
      </div>

      <!-- 已选导航 -->
      <div class="nav-seleted bd full-1">
        <div class="nav-config-title">导航配置</div>

        <div class="nav-seleted-info">
          <!-- 导航自定义 -->
          <div class="nav-seleted-box">
            <div class="nav-seleted-title">导航自定义</div>

            <div class="nav-seleted-second-box">
              <div class="nav-seleted-second-title">一级导航</div>

              <draggable
                class="nav-seleted-container first-nav"
                :class="{ disabled : oneDisabled }"
                :options="optionsSelectedFristNav"
                :list="selectedFirstNav"
                handle=".nav-unit-item"
                :move="onMove"
                :disabled="oneDisabled"
                @start="onStart"
                @end="onEnd"
                ghostClass="ghostClass"
                chosenClass="ghostClass"
                dragClass="ghostClass"
              >
                <transition-group tag="ul" class="selectedFirstNav">
                  <li
                    v-for="(item, index) in selectedFirstNav"
                    :key="`selected-first-nav-${index}`"
                    class="nav-unit-item"
                    :class="{ active: activeNavData.key ==  `selected-first-nav-${item.id}`}"
                    :only="item.only"
                    @click="
                      handelSelectNav({
                        data: item,
                        index,
                        list: selectedFirstNav,
                        key: `selected-first-nav-${item.id}`,
                        isFirst: true
                      })
                    "
                  >
                    <i class="icon-gedian"></i>
                    <span>{{ item.label }}</span>
                  </li>
                </transition-group>
              </draggable>
            </div>

            <div class="nav-seleted-second-box" v-if="secondNavBoxShow">
              <div class="nav-seleted-second-title">二级导航</div>

              <draggable
                class="nav-seleted-container second-nav"
                :class="{ disabled : twoDisabled }"
                :options="optionsSelectedSecondNav"
                :list="selectedSecondNav"
                handle=".nav-unit-item"
                :move="onMove"
                :disabled="twoDisabled"
                @start="onStart"
                @end="onEnd"
                ghostClass="ghostClass"
                chosenClass="ghostClass"
                dragClass="ghostClass"
              >
                <transition-group tag="ul" class="selectedFirstNav">
                  <li
                    v-for="(item, index) in selectedSecondNav"
                    :key="`selected-second-nav-${index}`"
                    class="nav-unit-item"
                    :class="{ active: activeNavData.key ==  `selected-second-nav-${item.id}`}"
                    :only="item.only"
                    @click="
                      handelSelectNav({
                        data: item,
                        index,
                        list: selectedSecondNav,
                        key: `selected-second-nav-${item.id}`,
                        isFirst: false
                      })
                    "
                  >
                    <i class="icon-gedian"></i>
                    <span>{{ item.label }}</span>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </div>

          <!-- 属性设置 -->

          <div class="nav-seleted-box" v-if="activeNavData.data">
            <div class="nav-seleted-title">属性设置</div>
            <div class="nav-seleted-attr-box">
              <div class="nav-seleted-attr">
                <div class="nav-seleted-attr-label">显示名称</div>
                <el-input
                  v-model="activeNavData.data.label"
                  size="mini"
                ></el-input>
              </div>
              <div
                class="nav-seleted-attr"
                v-if="activeNavData.data.type == 'link'"
              >
                <div class="nav-seleted-attr-label">URL链接</div>
                <el-input
                  v-model="activeNavData.data.link"
                  size="mini"
                ></el-input>
              </div>
              <div class="nav-seleted-attr">
                <div class="nav-seleted-attr-label">固定名称</div>
                <div class="nav-seleted-attr-fixed">
                  {{ activeNavData.data.name }}
                </div>
              </div>
              <div class="nav-seleted-attr">
                <div class="nav-seleted-attr-label">描述</div>
                <el-input
                  v-model="activeNavData.data.des"
                  size="mini"
                  type="textarea"
                ></el-input>
              </div>
              <div class="nav-seleted-attr">
                <div class="nav-seleted-attr-label"></div>
                <el-button
                  type="danger"
                  size="mini"
                  @click="handelDelActiveNav"
                  >移除</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "NavConfig",
  components: {
    draggable,
  },
  data() {
    return {
      unit: [
        {
          name: "通用组件",
          children: [
            {
              name: "一级导航",
              type: "first",
              only: "first"
            },
            {
              name: "自定义链接",
              type: "link",
              only: "second"
            },
          ],
        },
        {
          name: "功能组件",
          children: [
            {
              name: "我的工作台",
              only: "first"
            },
            {
              name: "我的项目",
            },
          ],
        },
      ],
      selectedFirstNav: [],
      selectedSecondNav: [],
      activeNavData: {},
      oneDisabled: false,
      twoDisabled: false,
      id: 0,
    };
  },
  computed: {
    optionsUnit() {
      return {
        animation: 150,
        group: {
          name: "people",
          pull: "clone",
          put: false,
        },
        ghostClass: "ghost",
        sort: false,
      }
    },
    optionsSelectedFristNav() {
      return {
        animation: 0,
        group: "people",
      }
    },
    optionsSelectedSecondNav() {
      return {
        animation: 0,
        group: "people",
      }
    },
    secondNavBoxShow() {
      const data = this.activeNavData
      return data.data && (!data.isFirst || data.isFirst && data.data.children)
    }
  },
  methods: {
    handelSelectNav(item) {
      this.activeNavData = item;
      if( item.isFirst && item.data.children ){
        this.selectedSecondNav = item.data.children
      }
    },
    handelDelActiveNav() {
      this.activeNavData.list.splice(this.activeNavData.index, 1);
      this.activeNavData = {};
    },
    cloneDog({ name, type, only }) {
      const res = {
        id: this.id++,
        name,
        type,
        only,
        label: name,
        des: "",
      };
      if (type == "first") {
        res.children = [];
      } else if (type == "link") {
        res.link = "";
      }
      return res;
    },
    onStart(evt) {
      let only = evt.item.getAttribute('only')
      if( only ) this[`${only == 'second' ? 'one' : 'two'}Disabled`] = true
    },
    onMove(evt) {
    },
    onEnd(evt) {
      this.oneDisabled = false
      this.twoDisabled = false
    },
    removeCallback(index) {
      this.selectedFirstNav.splice(index, 1);
      console.log(this.selectedFirstNav);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-config-box {
  overflow: hidden;
  .nav-library {
    float: left;
    width: 270px;
    .library-second-box {
      padding: 20px 20px 0;
    }
    .library-second-title {
      padding-bottom: 4px;
    }
  }
  .nav-seleted {
    float: right;
    width: calc(100% - 300px);
    margin-left: 0px;
  }
  .nav-config-title {
    font-size: 12px;
    color: #43484d;
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #e1e8ee;
  }
}

.nav-unit-item {
  float: left;
  width: 110px;
  height: 32px;
  padding-left: 20px;
  font-size: 12px;
  color: #909399;
  line-height: 32px;
  background: #fefefe;
  border-radius: 4px;
  border: 1px solid #e3eaef;
  position: relative;
  box-sizing: border-box;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;

  &.ghostClass {
    background-color: #f86;
    border: 1px solid #f86;
    color: #fff;
    i {
      color: #fff;
    }
  }

  &.active {
    background-color: #FAE8E1;
    border: 1px solid #FAE8E1;
    color: #FB7741;
    i {
      color: #FB7741;
    }
  }
  i {
    color: #636a7d;
    position: absolute;
    left: 2px;
    top: 1px;
    transform: scale(0.8);
  }
}

.nav-unit {
  overflow: hidden;
  .nav-unit-item {
    &:nth-child(even) {
      margin-right: 0px;
    }
  }
}

.nav-seleted-info {
  padding: 0 20px;

  .nav-seleted-box {
    margin-top: 22px;
    border-top: 1px solid #e1e8ee;
    position: relative;

    .nav-seleted-title {
      width: 98px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e1e8ee;
      position: absolute;
      top: -14px;
      left: 50%;
      margin-left: -49px;
    }
  }

  .nav-seleted-second-box {
    .nav-seleted-second-title {
      line-height: 34px;
      color: #999;
    }
  }

  .nav-seleted-container {
    overflow: hidden;
    min-height: 55px;
    background: #f6f8fa;
    padding: 10px 15px 0px;
    position: relative;

    &.disabled.second-nav::after {
      content: '此组件只能作为一级导航';
    }

    &.disabled.first-nav::after {
      content: '此组件只能作为二级导航';
    }

    &.disabled::after {
      color: rgb(255, 255, 255, .6);
      line-height: 50px;
      text-align: center;
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 2;
      background: rgba(0, 0, 0, .8);
    }
  }
}

.selectedFirstNav {
  overflow: hidden;
}

.nav-seleted-attr-box {
  padding-top: 30px;
  width: 450px;
  .nav-seleted-attr {
    position: relative;
    padding: 4px 0 4px 80px;
  }
  .nav-seleted-attr-label {
    position: absolute;
    line-height: 28px;
    top: 4px;
    left: 0;
    width: 60px;
    text-align: right;
    color: #606266;
  }
  .nav-seleted-attr-fixed {
    line-height: 28px;
  }
}
</style>
