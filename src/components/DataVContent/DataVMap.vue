<template>
    <div class="chinaecharts">
        <div id="mapChart" ref="mapChart" ></div>
    </div>
</template>
<script>
export default {
    name: 'ChinaEcharts',
    props: {
      data: {
        type: Array
      }
    },
    methods: {
        mapFn(){
            // 基于准备好的dom，初始化echarts实例
            // var mapChart = this.$echarts.init(this.$refs.mapChart);
            var mapChart = this.$echarts.init(document.getElementById('mapChart'));
            mapChart.setOption({
                backgroundColor: '', //背景颜色
                // title: {
                //     text: '中国',
                //     subtext: 'China',
                //     color: '#fff',
                //     // sublink: 'http://www.pm25.in',
                //     x:'center',
                // },
                //是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
                visualMap: {
                    min: 0, //最小值
                    max: 10, //最大值
                    calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
                    inRange: {
                        color: ['#fb714c', '#70b4f4', '#70e4f4', '#f09640', '#f9d9bb'] //颜色
                    },
                    textStyle: {
                        color: '#5cd9e8'
                    },
                },
                // 提示框，鼠标移入
                tooltip:{
                    show:true, //鼠标移入是否触发数据
                    trigger: 'item', //出发方式
                    formatter:'{b}-销售数量：{c}'
                },
                //配置地图的数据，并且显示
                series:[
                    {
                        name:'地图',
                        type: 'map',  //地图种类
                        map: 'china', //地图类型。
                        data:this.data,
                        itemStyle: { //地图区域的多边形 图形样式。
                          emphasis:{ //高亮状态下的样试
                              label:{
                                  show:true,
                              }
                          }
                        },
                        zoom:1.2,//放大比例
                        label: {  //图形上的文本标签，可用于说明图形的一些数据信息
                          show:true,
                          textStyle: {
                                fontSize: 12,
                                color: 'white'
                            }
                        }
                    },
                    // {
                    //     type:'scatter',
                    //     showEffectOn: 'render',//配置什么时候显示特效
                    //     coordinateSystem:'geo',//该系列使用的坐标系
                    //     symbolSize:10,//标记的大小
                    //     data:[
                    //         {name: '宜昌', value: [111.3,30.7,130]},
                    //     ],
                    //     zlevel:99999
                    // },
                ]
            }),
            window.addEventListener('resize', () => {
                // 自动渲染echarts
                mapChart.resize();
            })
        }
    },
    mounted () {
      this.mapFn();
    }
}
</script>
<style scoped>
.chinaecharts {
    width: 90%;
    height: 90%;
    /* margin: 5px 5px; */
}
#mapChart {
    width: 100%;
    height: 100%;
}
</style>
