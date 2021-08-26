<template>
<div>

<div>

<div style="width:auto;height:100%;float:left" >
  <div style="width:256px;display: flex;justify-content: center;align-items: center;" v-if="this.Data.tags">
    <img src="vue.jpeg" width="43px">
  </div>
<a-affix :offset-top="top" >
  <div v-if="this.Data.tags">
    <a-menu style="width: 256px" mode="vertical" >
<a-menu-item :key="index" v-for="(items,index) in this.Data.tags" @click="handleClick(items)">
    {{items.description}} {{items.name}}
</a-menu-item>
    </a-menu>
  </div>
    </a-affix>
  </div>

  <div style="width: 40%;height:100%;float:left;display: inline-block;margin-left:10px;">
    <div>
    <div style="width: 80%;float:left">
     <a-input-search
      placeholder="输入swagger.json的接口地址"
      enter-button="请求JSON"
      size="large"
      v-model="axiosurl"
      @search="handclick()"
    />
    </div>
    <div style="width:20%;float:left;margin-left:20px auto;margin-right:20px auto">
    <div >
      &nbsp;&nbsp;&nbsp;&nbsp;<a-button @click="show" type="primary" size="large" icon="swap">点击转换</a-button></div>
    </div>
    </div>
     <br><br>
    <div style="height: 850px;width: 80%;">
     
  <a-textarea placeholder="输入需要转换的JSON" :rows="42" v-model="text"/>
    </div>
  </div>

   <div style="width: 40%;float:left;display: inline-block;height: 850px;">
     <a-space>
     <a-button  type="danger" icon="download"  @click="download('swagger.md',content)" size="large">导出</a-button>
     <a-button  type="danger" icon="sync"  @click="clear()" size="large">清空</a-button>
      </a-space>
      <a-empty v-show="content==''"/>
    <markdown-it-vue class="md-body" :content="content"/>
  </div>
</div>
<div>
    <a-back-top />
    <strong style="color:rgba(64, 64, 64, 0.6)"> </strong>
  </div>





</div>


</template>
<script>
import Vue from 'vue'//引入vue
import axios from 'axios'//引入axios
import marked from 'marked'
import {Button} from 'ant-design-vue'
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'

Vue.component("axios",axios);
Vue.use(Button);

export default {
  components: {
    MarkdownItVue
  },
  data(){
    return{
      loading: false,
      text:"",
      tags:[],
      json:[],
      paths:[],
      schemas:[],
      Data:[],
      content: '',
      axiosurl:'',
      top: 10,
      // aaa:'swagger/project_api/swagger.json',
      current: ['mail'],
      openKeys: ['sub1'],
    }
  },
    watch: {
    openKeys(val) {
      console.log('openKeys', val);
      },
    },

    methods:{
        handleClick(items) {
          var name = items.name.toLowerCase()
          var description = items.description.toLowerCase()
          window.location.href="#"+description+"-"+name;
      // console.log("#"+items.description+"-"+items.name);
    },
      clear(){
        this.content='';
        this.text='';
        this.axiosurl='';
        this.Data=''
      },
      compiledMarkdown: function() {
      return marked(this.str, {});//第一个参数是你的markdown文本 第二个参数是选项
    },
      download(filename,filecontent){
        let content = new Blob([filecontent])
        let  urlObject = window.URL || window.webkitURL || window
        let url = urlObject.createObjectURL(content)
        let el = document.createElement('a')
        el.href = url
        el.download =filename
        el.click()
        urlObject.revokeObjectURL(url)
      },
      
      handclick(){
        axios.get(this.axiosurl).then(res=>
      {
        this.$notification.open({
        message: '请求成功',
        description:
          '接下来使用点击转换按钮转换markdown',
        icon: <a-icon type="smile" style="color: #108ee9" />,
      });
         this.text=JSON.stringify(res.data)
      }).catch((err) =>{
        console.log(err)
        this.$notification.open({
        message: '请求失败',
        description:
          '检查接口是否正确或者后端是否允许跨域',
        icon: <a-icon type="frown" style="color: #108ee9" />,
      });
      })
      },
      show(){
        var str = "";
        this.Data=JSON.parse(this.text);
        this.tags=this.Data.tags
        this.json=this.Data
        this.paths=this.Data.paths
        this.schemas=this.Data.components.schemas
        // console.log(this.paths)

        str +="# "+this.json.info.title+"\n"
        str +=this.json.openapi+"\xa0"+this.json.info.version+"\n"
        for (var item in this.tags){
          str+="\n"+"## "+this.tags[item].description+"\xa0"+this.tags[item].name+"\n"
          for(var forpaths in this.paths){

            // 遍历get请求

            if(this.paths[forpaths].get){
              if(this.paths[forpaths].get.tags==this.tags[item].name ){
                str+="\n\n"+"### 接口地址："+forpaths+"\n\n"+"* **请求方式：get**"+"\n\n"
                if(this.paths[forpaths].get.summary){
                  str+="* **接口功能："+this.paths[forpaths].get.summary+"**"+"\n\n"
                }
                if(this.paths[forpaths].get.parameters){
                  str+="* **请求参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                  for(var part in this.paths[forpaths].get.parameters){
                  
                    if(this.paths[forpaths].get.parameters[part].name){str+="|"+this.paths[forpaths].get.parameters[part].name+"|"}
                    if(this.paths[forpaths].get.parameters[part].schema.type){str+=this.paths[forpaths].get.parameters[part].schema.type+"|"}
                    else if(this.paths[forpaths].get.parameters[part].schema.$ref){str+="object|"}
                    else if(this.paths[forpaths].get.parameters[part].schema.items.$ref){str+="array|"}
                    else{str+=" |"}
                    if(this.paths[forpaths].get.parameters[part].required){str+=this.paths[forpaths].get.parameters[part].required+"|"}
                    else{str+="false|"}
                    if(this.paths[forpaths].get.parameters[part].description){str+=this.paths[forpaths].get.parameters[part].description+"|"+"\n"}
                    else{str+=" |"+"\n"}
                  }
                  for(var askrefget in this.paths[forpaths].get.parameters){
                   
                    if(this.paths[forpaths].get.parameters[askrefget].schema.$ref){
                      // console.log("1234")
                      for(var askschget in this.schemas){
                        if(this.paths[forpaths].get.parameters[askrefget].schema.$ref.includes(askschget)){
                          str+="\n"+"* 对象"+this.paths[forpaths].get.parameters[askrefget].name+"："
                          if(this.schemas[askschget].properties){
                            // console.log(this.schemas[askschget].description)
                            str+=this.schemas[askschget].description+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var pro1ask in this.schemas[askschget].properties){
                              //  if(!this.schemas[askschget].properties[pro1ask].$ref){
                                 str+="|"+pro1ask+"|"
                                 if(this.schemas[askschget].properties[pro1ask].type){
                                   str+=this.schemas[askschget].properties[pro1ask].type+"|"
                                 }
                                 else if(this.schemas[askschget].properties[pro1ask].$ref){
                                   str+="object|"
                                 }
                                 else if(this.schemas[askschget].properties[pro1ask].items.$ref){
                                   str+="array|"
                                 }
                                 else{str+=" |"}
                                 if(this.schemas[askschget].properties[pro1ask].description){
                                   str+=this.schemas[askschget].properties[pro1ask].description+"|"+"\n"
                                 }
                                 else{str+=" |"+"\n"}
                              //  }

                            }
                          }
                          else{
                            str+=this.schemas[askschget].description+"\n\n"+"\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschget].type+"\n"

                          }
                        }
                      }
                    }
                    if(this.paths[forpaths].get.parameters[askrefget].schema.items){
                      // console.log("11111")
                      if(this.paths[forpaths].get.parameters[askrefget].schema.items.$ref){
                      for(var askschget1 in this.schemas){
                        if(this.paths[forpaths].get.parameters[askrefget].schema.items.$ref.includes(askschget1)){
                          str+="\n"+"* 数组"+this.paths[forpaths].get.parameters[askrefget].name+"："
                          if(this.schemas[askschget1].properties){
                            str+=this.schemas[askschget1].description+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var pro1ask1 in this.schemas[askschget].properties){
                              str+="|"+pro1ask1+"|"
                               if(this.schemas[askschget].properties[pro1ask1].type){
                                 str+=this.schemas[askschget].properties[pro1ask1].type+"|"
                               }
                               else if(this.schemas[askschget].properties[pro1ask1].$ref){
                                 str+="project|"
                               }
                               else if(this.schemas[askschget].properties[pro1ask1].items.$ref){
                                 str+="array|"
                               }
                               else{str+=" |"}
                               if(this.schemas[askschget].properties[pro1ask1].description){
                                 str+=this.schemas[askschget].properties[pro1ask1].description+"|"+"\n"
                               }
                               else{str+=" |"+"\n"}
                            }
                          }
                          else{
                            str+=this.schemas[askschget1].description+"\n\n"+"\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschget1].type+"\n"
                          }
                        }
                      }
                      }
                    }
                  }
                }
                if(this.paths[forpaths].get.responses){
                  for(var res in this.paths[forpaths].get.responses){
                    if(this.paths[forpaths].get.responses[res].content){
                      for(var cont in this.paths[forpaths].get.responses[res].content){
                        if(cont=="text/json"){
                          if(this.paths[forpaths].get.responses[res].content[cont].schema.items){
                            if(this.paths[forpaths].get.responses[res].content[cont].schema.items.$ref){
                              // console.log(this.paths[forpaths].get.responses[res].content[cont].schema.items.$ref)
                              for(var sch1 in this.schemas){
                                if(this.paths[forpaths].get.responses[res].content[cont].schema.items.$ref.includes(sch1)){
                                  str+="\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                  for(var pro1 in this.schemas[sch1].properties){
                                       str+="|"+pro1+"|"
                                     if(this.schemas[sch1].properties[pro1].type){
                                       str+=this.schemas[sch1].properties[pro1].type+"|"
                                        }
                                        else if(this.schemas[sch1].properties[pro1].$ref){
                                          str+="object|"
                                        }
                                        // else if(this.schemas[sch1].properties[pro1].items.$ref){
                                        //   str+="array|"
                                        // }
                                        
                                       else{str+=" |"}
                                     if(this.schemas[sch1].properties[pro1].description){
                                        str+=this.schemas[sch1].properties[pro1].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}
                                     
                                     
                                  }
                                  for(var pro1get in this.schemas[sch1].properties){
                                  if(this.schemas[sch1].properties[pro1get].$ref){
                                    for(var rtschget in this.schemas){
                                      if(this.schemas[sch1].properties[pro1get].$ref.includes(rtschget)){
                                        str+="\n"+"* 返回对象"+pro1+"："
                                        if(this.schemas[rtschget].properties){
                                          str+=this.schemas[rtschget].description+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                          for(var pro1rt in this.schemas[rtschget].properties){
                                            str+="|"+pro1rt+"|"
                                            if(this.schemas[rtschget].properties[pro1rt].type){
                                              str+=this.schemas[rtschget].properties[pro1rt].type+"|"
                                            }
                                            else if(this.schemas[rtschget].properties[pro1rt].$ref){
                                              str+="object|"
                                            }
                                            else if(this.schemas[rtschget].properties[pro1rt].items.$ref){
                                              str+="array|"
                                            }
                                            else{
                                              str+=" |"
                                            }
                                            if(this.schemas[rtschget].properties[pro1rt].description){
                                              str+=this.schemas[rtschget].properties[pro1rt].description+"|"+"\n"
                                            }
                                            else{str+=" |" +"\n"}
                                          }
                                        }
                                        else{
                                          // console.log(this.schemas[rtschget].description)
                                          str+=this.schemas[rtschget].description+"\n\n"
                                          if(this.schemas[rtschget].type){
                                            str+="\xa0\xa0\xa0\xa0* 类型："+this.schemas[rtschget].type+"\n"
                                          }
                                        }
                                      }
                                    }
                                  }
                                  // if(this.schemas[sch1].properties[pro1get].items.$ref){
                                  //   console.log("1231321")
                                  // }
                                  }
                                }
                              }
                            }
                          }
                      if(this.paths[forpaths].get.responses[res].content[cont].schema.$ref){
                        for(var sch in this.schemas){
                          if(this.paths[forpaths].get.responses[res].content[cont].schema.$ref.includes(sch)){
                             str+="\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var pro in this.schemas[sch].properties){
                              // if(!this.schemas[sch].properties[pro].$ref){
                                str+="|"+pro+"|"
                                if(this.schemas[sch].properties[pro].type){
                                  str+=this.schemas[sch].properties[pro].type+"|"
                                }
                                else if(this.schemas[sch].properties[pro].$ref){
                                  str+="project|"
                                }
                                else{str+=" |"}
                                if(this.schemas[sch].properties[pro].description){
                                  str+=this.schemas[sch].properties[pro].description+"|"+"\n"
                                }
                                else{str+=" |"+"\n"}
                              // }
                            }
                            for(var pro1get1 in this.schemas[sch].properties){
                               if(this.schemas[sch].properties[pro1get1].$ref){
                                 for(var rtschget1 in this.schemas){
                                   if(this.schemas[sch].properties[pro1get1].$ref.includes(rtschget1)){
                                     str+="\n"+"* 返回对象"+pro+"："
                                     if(this.schemas[rtschget1].properties){
                                       str+=this.schemas[rtschget1].description+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                       for(var pro1rt1 in this.schemas[rtschget1].properties){
                                        str+="|"+pro1rt1+"|"
                                        if(this.schemas[rtschget1].properties[pro1rt1].type){
                                          str+=this.schemas[rtschget1].properties[pro1rt1].type+"|"
                                        }
                                        else if(this.schemas[rtschget1].properties[pro1rt1].$ref){
                                          str+="object|"
                                        }
                                        else if(this.schemas[rtschget1].properties[pro1rt1].items.$ref){
                                          str+="array|"
                                        }
                                        else{
                                          str+=" |"
                                        }
                                        if(this.schemas[rtschget1].properties[pro1rt1].description){
                                          str+=this.schemas[rtschget1].properties[pro1rt1].description+"|"+"\n"
                                        }
                                        else{str+=" |" +"\n"}
                                      }
                                     }
                                     else{
                                       str+=this.schemas[rtschget1].description+"\n\n"
                                       if(this.schemas[rtschget1].type){
                                         str+="\xa0\xa0\xa0\xa0* 类型："+this.schemas[rtschget1].type+"\n"
                                       }
                                     }
                                   }
                                 }
                               }
                            }
                          }
                          
                        }

                      }
                    }
                    }
                    }
                  }

                }str+="\n"+"-----"+"\n"
                

              }
            }

            // 遍历post请求

            if(this.paths[forpaths].post){
              if(this.paths[forpaths].post.tags==this.tags[item].name ){
                str+="\n\n"+"### 接口地址："+forpaths+"\n\n"+"* **请求方式：post**"+"\n\n"
                if(this.paths[forpaths].post.summary){
                  str+="* **接口功能："+this.paths[forpaths].post.summary+"**"+"\n\n"
                }
                if(this.paths[forpaths].post.requestBody){
                  if(this.paths[forpaths].post.requestBody.description){
                    str+="description"+this.paths[forpaths].post.requestBody.description+"\n\n"
                  }
                  str+="* **请求参数说明：**"+"\n\n"+ " | 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                  
                  for(var rebody in this.paths[forpaths].post.requestBody.content){
                    if(rebody=="text/json"){
                      if(this.paths[forpaths].post.requestBody.content[rebody].schema.$ref){
                        // console.log(this.paths[forpaths].post.requestBody.content[rebody].schema.$ref)
                        for(var sch2 in this.schemas){
                                if(this.paths[forpaths].post.requestBody.content[rebody].schema.$ref.includes(sch2)){
                                  for(var pro2 in this.schemas[sch2].properties){
                                    str+="|"+pro2+"|"
                                    if(this.schemas[sch2].properties[pro2].type){
                                      str+=this.schemas[sch2].properties[pro2].type+"|"
                                    }
                                    else if(this.schemas[sch2].properties[pro2].$ref){
                                      str+="object|"
                                    }
                                    else if(this.schemas[sch2].properties[pro2].items.$ref){
                                      str+="array|"
                                    }
                                    else{str+=" |"}
                                    if(this.schemas[sch2].required){
                                      for(var req in this.schemas[sch2].required){
                                        // console.log(this.schemas[sch2].required[req])
                                        // console.log("pro2 "+pro2)
                                        if(this.schemas[sch2].required[req]==pro2){
                                          str+="ture|"
                                        }
                                      }
                                    }
                                    else{str+="false|"}
                                    var isture = str.substr(-5)
                                    if(isture!=='ture|'){
                                      str+="false|"
                                    }
                                    
                                    
                                    if(this.schemas[sch2].properties[pro2].description){
                                    str+=this.schemas[sch2].properties[pro2].description+"|"+"\n"
                                  }
                                  else{str+=" |"+"\n"}
                                  }
                                  for(var pro2ask in this.schemas[sch2].properties){
                                    if(this.schemas[sch2].properties[pro2ask].$ref){
                                      for(var askschpost in this.schemas){
                                        if(this.schemas[sch2].properties[pro2ask].$ref.includes(askschpost)){
                                          str+="\n"+"* 数组"+pro2ask+"："
                                          if(this.schemas[askschpost].properties){
                                            str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var askpropost in this.schemas[askschpost].properties){
                                              str+="|"+askpropost+"|"
                                              if(this.schemas[askschpost].properties[askpropost].type){
                                                str+=this.schemas[askschpost].properties[askpropost].type+"|"
                                              }
                                              else if(this.schemas[askschpost].properties[askpropost].$ref){
                                                str+="object|"
                                              }
                                              else if(this.schemas[askschpost].properties[askpropost].items.$ref){
                                                str+="array|"
                                              }
                                              else{str+=" |"}
                                              if(this.schemas[askschpost].properties[askpropost].description){
                                                str+=this.schemas[askschpost].properties[askpropost].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}
                                            }
                                          }
                                          else{
                                            str+=this.schemas[askschpost].description+"\n\n"
                                            if(this.schemas[askschpost].type){
                                              str+="\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschpost].type+"\n"
                                            }
                                          }
                                        }
                                      }
                                    }

                                  }
                                  for(var pro2ask1 in this.schemas[sch2].properties){
                                    if(this.schemas[sch2].properties[pro2ask1].$ref){
                                      for(var askschpost1 in this.schemas){
                                        if(this.schemas[sch2].properties[pro2ask1].$ref.includes(askschpost1)){
                                          str+="\n"+"* 对象"+pro2ask1+"："
                                          if(this.schemas[askschpost1].properties){
                                            str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var askpropost1 in this.schemas[askschpost1].properties){
                                              str+="|"+askpropost1+"|"
                                              if(this.schemas[askschpost1].properties[askpropost1].type){
                                                str+=this.schemas[askschpost1].properties[askpropost1].type+"|"
                                              }
                                              else if(this.schemas[askschpost1].properties[askpropost1].$ref){
                                                str+="object|"
                                              }
                                              else if(this.schemas[askschpost1].properties[askpropost1].items.$ref){
                                                str+="array|"
                                              }
                                              else{str+=" |"}
                                              if(this.schemas[askschpost1].properties[askpropost1].description){
                                                // console.log(this.schemas[askschpost1].properties[askpropost1].description)
                                                str+=this.schemas[askschpost1].properties[askpropost1].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}
                                            }
                                          }
                                          else{
                                            str+=this.schemas[askschpost1].description+"\n\n"
                                            if(this.schemas[askschpost1].type){
                                              str+="\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschpost1].type+"\n"
                                            }
                                          }
                                        }
                                      }
                                    }

                                  }
                                  
                                }
                              }
                      }

                    }
                  }
                }
                if(this.paths[forpaths].post.responses){
                   for(var resp in this.paths[forpaths].post.responses){
                     if(this.paths[forpaths].post.responses[resp].content){
                       for(var contp in this.paths[forpaths].post.responses[res].content){
                         if(contp=="text/json"){
                           if(this.paths[forpaths].post.responses[resp].content[contp].schema.items){
                             if(this.paths[forpaths].post.responses[resp].content[contp].schema.items.$ref){
                               for(var schp1 in this.schemas){
                                if(this.paths[forpaths].post.responses[resp].content[contp].schema.items.$ref.includes(schp1)){
                                  str+="\n\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                  for(var prop1 in this.schemas[schp1].properties){
                                    // if(!this.schemas[schp1].properties[prop1].$ref){
                                       str+="|"+prop1+"|"
                                     if(this.schemas[schp1].properties[prop1].type){
                                       str+=this.schemas[schp1].properties[prop1].type+"|"
                                        }
                                       else{str+=" |"}
                                     if(this.schemas[schp1].properties[prop1].description){
                                        str+=this.schemas[schp1].properties[prop1].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}
                                    //  }

                                  }
                                  for(var pro1post in this.schemas[schp1].properties){
                                    if(this.schemas[schp1].properties[pro1post].$ref){
                                      for(var rtschpost in this.schemas){
                                        if(this.schemas[schp1].properties[pro1post].$ref.includes(rtschpost)){
                                          str+="\n"+"* 返回对象"+pro1post+"："
                                          if(this.schemas[rtschpost].properties){
                                            str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var postrt in this.schemas[rtschpost].properties){
                                              str+="|"+postrt+"|"
                                              if(this.schemas[rtschpost].properties[postrt].type){
                                                str+=this.schemas[rtschpost].properties[postrt].type+"|"
                                              }
                                              else if(this.schemas[rtschpost].properties[postrt].$ref){
                                              str+="project|"
                                               }
                                              else if(this.schemas[rtschpost].properties[postrt].items.$ref){
                                                str+="array|"
                                                }
                                              else{str+=" |"}
                                              if(this.schemas[rtschpost].properties[postrt].description){
                                                str+=this.schemas[rtschpost].properties[postrt].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}
                                            }
                                          }
                                          else{
                                            str+=this.schemas[rtschpost].description+"\n\n"
                                            if(this.schemas[rtschpost].type){
                                              str+=this.schemas[rtschpost].type+"\n"
                                            }
                                            
                                          }
                                        }
                                      }
                                    }
                                  }
                                  for(var pro1post1 in this.schemas[schp1].properties){
                                    if(this.schemas[schp1].properties[pro1post1].items.$ref){
                                      for(var rtschpost1 in this.schemas){
                                        if(this.schemas[schp1].properties[pro1post1].items.$ref.includes(rtschpost1)){
                                          str+="\n"+"* 返回数组"+pro1post1+"："
                                          if(this.schemas[rtschpost1].properties){
                                            str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var postrt1 in this.schemas[rtschpost1].properties){
                                              str+="|"+postrt1+"|"
                                              if(this.schemas[rtschpost1].properties[postrt1].type){
                                                str+=this.schemas[rtschpost1].properties[postrt1].type+"|"
                                              }
                                              else if(this.schemas[rtschpost1].properties[postrt1].$ref){
                                              str+="project|"
                                               }
                                              else if(this.schemas[rtschpost1].properties[postrt1].items.$ref){
                                                str+="array|"
                                                }
                                              else{str+=" |"}
                                              if(this.schemas[rtschpost1].properties[postrt1].description){
                                                str+=this.schemas[rtschpost1].properties[postrt1].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}
                                            }
                                          }
                                          else{
                                            str+=this.schemas[rtschpost1].description+"\n\n"
                                            if(this.schemas[rtschpost1].type){
                                              str+=this.schemas[rtschpost1].type+"\n"
                                            }
                                            
                                          }
                                        }
                                      }
                                    }
                                  }

                                }
                              }
                             }
                            if(this.paths[forpaths].post.responses[resp].content[contp].schema.$ref){
                        for(var schp in this.schemas){
                          if(this.paths[forpaths].post.responses[resp].content[contp].schema.$ref.includes(schp)){
                             str+="\n\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var prop in this.schemas[schp].properties){
                              // if(!this.schemas[schp].properties[prop].$ref){
                                str+="|"+prop+"|"
                                if(this.schemas[schp].properties[prop].type){
                                  str+=this.schemas[schp].properties[prop].type+"|"
                                }
                                else{str+=" |"}
                                if(this.schemas[schp].properties[prop].description){
                                  str+=this.schemas[schp].properties[prop].description+"|"+"\n"
                                }
                                else{str+=" |"+"\n"}
                              // }
                              

                            }
                            for(var pro1post2 in this.schemas[schp1].properties){
                                    if(this.schemas[schp1].properties[pro1post2].$ref){
                                      for(var rtschpost2 in this.schemas){
                                        if(this.schemas[schp1].properties[pro1post2].$ref.includes(rtschpost2)){
                                          str+="\n"+"* 返回对象"+pro1post2+"："
                                          if(this.schemas[rtschpost2].properties){
                                            str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var postrt2 in this.schemas[rtschpost2].properties){
                                              str+="|"+postrt2+"|"
                                              if(this.schemas[rtschpost2].properties[postrt2].type){
                                                str+=this.schemas[rtschpost2].properties[postrt2].type+"|"
                                              }
                                              else if(this.schemas[rtschpost2].properties[postrt2].$ref){
                                              str+="project|"
                                               }
                                              else if(this.schemas[rtschpost2].properties[postrt2].items.$ref){
                                                str+="array|"
                                                }
                                              else{str+=" |"}
                                              if(this.schemas[rtschpost2].properties[postrt2].description){
                                                str+=this.schemas[rtschpost2].properties[postrt2].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}
                                            }
                                          }
                                          else{
                                            str+=this.schemas[rtschpost2].description+"\n\n"
                                            if(this.schemas[rtschpost2].type){
                                              str+=this.schemas[rtschpost2].type+"\n"
                                            }
                                            
                                          }
                                        }
                                      }
                                    }
                                  }
                                   for(var pro1post3 in this.schemas[schp1].properties){
                                    if(this.schemas[schp1].properties[pro1post3].$ref){
                                      for(var rtschpost3 in this.schemas){
                                        if(this.schemas[schp1].properties[pro1post3].$ref.includes(rtschpost3)){
                                          str+="\n"+"* 返回对象"+pro1post3+"："
                                          if(this.schemas[rtschpost3].properties){
                                            str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var postrt3 in this.schemas[rtschpost3].properties){
                                              str+="|"+postrt3+"|"
                                              if(this.schemas[rtschpost3].properties[postrt3].type){
                                                str+=this.schemas[rtschpost3].properties[postrt3].type+"|"
                                              }
                                              else if(this.schemas[rtschpost3].properties[postrt3].$ref){
                                              str+="project|"
                                               }
                                              else if(this.schemas[rtschpost3].properties[postrt3].items.$ref){
                                                str+="array|"
                                                }
                                              else{str+=" |"}
                                              if(this.schemas[rtschpost3].properties[postrt3].description){
                                                str+=this.schemas[rtschpost3].properties[postrt3].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}
                                            }
                                          }
                                          else{
                                            str+=this.schemas[rtschpost3].description+"\n\n"
                                            if(this.schemas[rtschpost3].type){
                                              str+=this.schemas[rtschpost3].type+"\n"
                                            }
                                            
                                          }
                                        }
                                      }
                                    }
                                  }
                                  
                          }
                          
                        }

                               }
                           }
                         }

                       }
                     }
                   }
                }str+="\n"+"-----"+"\n"


              }
            }

            // 遍历put请求

            if(this.paths[forpaths].put){
               if(this.paths[forpaths].put.tags==this.tags[item].name ){
                 str+="\n\n"+"### 接口地址："+forpaths+"\n\n"+"* **请求方式：put**"+"\n\n"
                 if(this.paths[forpaths].put.summary){
                  str+="* **接口功能："+this.paths[forpaths].put.summary+"**"+"\n\n"
                 }
                 if(this.paths[forpaths].put.requestBody){
                    if(this.paths[forpaths].put.requestBody.description){
                      str+="* **接口描述："+this.paths[forpaths].put.requestBody.description+"** \n\n"
                    }
                     str+="* **请求参数说明：**"+"\n\n"+ " | 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                     for(var rebodyput in this.paths[forpaths].put.requestBody.content){
                       if(rebodyput=="text/json"){
                         if(this.paths[forpaths].put.requestBody.content[rebodyput].schema.$ref){
                           for(var sch2put in this.schemas){
                             if(this.paths[forpaths].put.requestBody.content[rebodyput].schema.$ref.includes(sch2put)){
                               for(var pro2put in this.schemas[sch2put].properties){
                                //  if(!this.schemas[sch2put].properties[pro2put].$ref){
                                   str+="|"+pro2put+"|"
                                   if(this.schemas[sch2put].properties[pro2put].type){
                                     str+=this.schemas[sch2put].properties[pro2put].type+"|"
                                   }
                                   else if(this.schemas[sch2put].properties[pro2put].$ref){
                                     str+="project|"
                                   }
                                   else if(this.schemas[sch2put].properties[pro2put].items.$ref){
                                     str+="array|"
                                   }
                                   else{str+=" |"}
                                   if(this.schemas[sch2put].required){
                                     for(var reqput in this.schemas[sch2put].required){
                                        if(this.schemas[sch2put].required[reqput]==pro2put){
                                          str+="ture|"
                                        } 
                                     }
                                     var istureput = str.substr(-5)
                                    if(istureput!=='ture|'){
                                      str+="false|"
                                    }

                                   }else{str+="false|"}
                                   if(this.schemas[sch2put].properties[pro2put].description){
                                     str+=this.schemas[sch2put].properties[pro2put].description+"|"+"\n"
                                   }
                                   else{str+=" |"+"\n"}
                                   if(this.schemas[sch2put].properties[pro2put].$ref){
                                     for(var askschput in this.schemas){
                                       if(this.schemas[sch2put].properties[pro2put].$ref.includes(askschput)){
                                         str+="\n"+"* 对象"+pro2put+"："
                                         if(this.schemas[sch2put].properties){
                                           str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var putproask in this.schemas[askschget].properties){
                                              str+="|"+putproask+"|"
                                              if(this.schemas[askschget].properties[putproask].type){
                                                str+=this.schemas[askschget].properties[putproask].type+"|"
                                              }
                                              else if(this.schemas[askschget].properties[putproask].$ref){
                                                str+="object|"
                                              }
                                              else if(this.schemas[askschget].properties[putproask].items.$ref){
                                                str+="array|"
                                              }
                                              else{str+=" |"}
                                              if(this.schemas[askschget].properties[putproask].description){
                                                str+=this.schemas[askschget].properties[putproask].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}

                                            }

                                         }
                                         else{
                                           str+=this.schemas[askschget].description+"\n\n"+"\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschget].type+"\n"
                                         }
                                       }
                                     }
                                   }
                                   if(this.schemas[sch2put].properties[pro2put].items){
                                     if(this.schemas[sch2put].properties[pro2put].items.$ref){
                                       for(var askschput1 in this.schemas){
                                       if(this.schemas[sch2put].properties[pro2put].items.$ref.includes(askschput1)){
                                         str+="\n"+"* 数组"+pro2put+"："
                                         if(this.schemas[sch2put].properties){
                                           str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                            for(var putproask1 in this.schemas[askschget].properties){
                                              str+="|"+putproask1+"|"
                                              if(this.schemas[askschget].properties[putproask1].type){
                                                str+=this.schemas[askschget].properties[putproask1].type+"|"
                                              }
                                              else if(this.schemas[askschget].properties[putproask1].$ref){
                                                str+="object|"
                                              }
                                              else if(this.schemas[askschget].properties[putproask1].items.$ref){
                                                str+="array|"
                                              }
                                              else{str+=" |"}
                                              if(this.schemas[askschget].properties[putproask1].description){
                                                str+=this.schemas[askschget].properties[putproask1].description+"|"+"\n"
                                              }
                                              else{str+="|"+"\n"}

                                            }

                                         }
                                         else{
                                           str+=this.schemas[askschget].description+"\n\n"+"\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschget].type+"\n"
                                         }
                                       }
                                     }
                                     }
                                   }
                                //  }

                               }
                               
                             }
                           }
                         }
                       }

                     }
                 }
                 if(this.paths[forpaths].put.responses){
                   for(var resput in this.paths[forpaths].put.responses){
                     if(this.paths[forpaths].put.responses[resput].content){
                       for(var contput in this.paths[forpaths].put.responses[resput].content){
                         if(contput=="text/json"){
                           if(this.paths[forpaths].put.responses[resput].content[contput].schema.items){
                             if(this.paths[forpaths].put.responses[resput].content[contput].schema.items.$ref){
                               for(var schput1 in this.schemas){
                                 if(this.paths[forpaths].put.responses[resput].content[contput].schema.items.$ref.includes(schput1)){
                                   str+="\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                   for(var proput1 in this.schemas[schput1].properties){
                                    //  if(!this.schemas[schput1].properties[proput1].$ref){
                                       str+="|"+proput1+"|"
                                       if(this.schemas[schput1].properties[proput1].type){
                                         str+=this.schemas[schput1].properties[proput1].type+"|"
                                       }
                                       else if(this.schemas[schput1].properties[proput1].$ref){
                                         str+="project|"
                                       }
                                       else if(this.schemas[schput1].properties[proput1].items.$ref){
                                         str+="array|"
                                       }
                                       else{
                                         str+=" |"
                                       }
                                       if(this.schemas[schput1].properties[proput1].description){
                                         str+=this.schemas[schput1].properties[proput1].description+"|"+"\n"
                                       }
                                       else{
                                         str+=" |"+"\n"
                                       }
                                    //  }
                                   }
                                   for(var pro1put in this.schemas[schput].properties){
                                  if(this.schemas[schput].properties[pro1put].$ref){
                                    for(var rtschput in this.schemas){
                                      if(this.schemas[schput].properties[pro1put].$ref.includes(rtschput)){
                                        str+="\n"+"* 返回对象"+proput+"："
                                        
                                        if(this.schemas[rtschput].properties){
                                        //   if(this.schemas[rtschput].description){
                                        //   str+=this.schemas[rtschput].description
                                        // }
                                          str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                          for(var putrt in this.schemas[rtschput].properties){
                                            str+="|"+putrt+"|"
                                            if(this.schemas[rtschput].properties[putrt].type){
                                              str+=this.schemas[rtschput].properties[putrt].type+"|"
                                            }
                                            else if(this.schemas[rtschput].properties[putrt].$ref){
                                              str+="object|"
                                            }
                                            else if(this.schemas[rtschput].properties[putrt].items.$ref){
                                              str+="array|"
                                            }
                                            else{
                                              str+=" |"
                                            }
                                            if(this.schemas[rtschput].properties[putrt].description){
                                              str+=this.schemas[rtschput].properties[putrt].description+"|"+"\n"
                                            }
                                            else{
                                              str+="|"+"\n"
                                            }
                                          }
                                        }
                                        else{
                                          str+=this.schemas[rtschput].description+"\n\n"
                                          if(this.schemas[rtschput].type){
                                            str+=this.schemas[rtschput].type+"\n"
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                for(var pro1put2 in this.schemas[schput].properties){
                                  if(this.schemas[schput].properties[pro1put2].items){
                                    if(this.schemas[schput].properties[pro1put2].items.$ref){
                                    for(var rtschput2 in this.schemas){
                                      if(this.schemas[schput].properties[pro1put2].items.$ref.includes(rtschput2)){
                                        str+="\n"+"* 返回数组"+proput+"："
                                        if(this.schemas[rtschput2].properties){
                                        //   if(this.schemas[rtschput2].description){
                                        //   str+=this.schemas[rtschput2].description
                                        // }
                                          str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                          for(var putrt2 in this.schemas[rtschput2].properties){
                                            str+="|"+putrt2+"|"
                                            if(this.schemas[rtschput2].properties[putrt2].type){
                                              str+=this.schemas[rtschput2].properties[putrt2].type+"|"
                                            }
                                            else if(this.schemas[rtschput2].properties[putrt2].$ref){
                                              str+="object|"
                                            }
                                            else if(this.schemas[rtschput2].properties[putrt2].items.$ref){
                                              str+="array|"
                                            }
                                            else{
                                              str+=" |"
                                            }
                                            if(this.schemas[rtschput2].properties[putrt2].description){
                                              str+=this.schemas[rtschput2].properties[putrt2].description+"|"+"\n"
                                            }
                                            else{
                                              str+="|"+"\n"
                                            }
                                          }
                                        }
                                        else{
                                          str+=this.schemas[rtschput2].description+"\n\n"
                                          if(this.schemas[rtschput2].type){
                                            str+=this.schemas[rtschput2].type+"\n"
                                          }
                                        }
                                      }
                                    }
                                  }
                                  }
                                }
                                 }

                               }
                             }
                           }
                           if(this.paths[forpaths].post.responses[resput].content[contput].schema.$ref){
                            for(var schput in this.schemas){
                              if(this.paths[forpaths].put.responses[resput].content[contput].schema.$ref.includes(schput)){
                                str+="\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                for(var proput in this.schemas[schput].properties){
                                  // if(!this.schemas[schput].properties[proput].$ref){
                                    str+="|"+proput+"|"
                                    if(this.schemas[schput].properties[proput].type){
                                       str+=this.schemas[schput].properties[proput].type+"|"
                                    }
                                    else{
                                      str+=" |"
                                    }
                                    if(this.schemas[schput].properties[proput].description){
                                      str+=this.schemas[schput].properties[proput].description+"|"+"\n"
                                    }
                                    else{
                                      str+=" |"+"\n"
                                      }
                                  // }
                                }
                                for(var pro1put1 in this.schemas[schput].properties){
                                  if(this.schemas[schput].properties[pro1put1].$ref){
                                    for(var rtschput1 in this.schemas){
                                      if(this.schemas[schput].properties[pro1put1].$ref.includes(rtschput1)){
                                        str+="\n"+"* 返回对象"+proput+"："
                                        if(this.schemas[rtschput1].properties){
                                        //   if(this.schemas[rtschput1].description){
                                        //   str+=this.schemas[rtschput1].description
                                        // }
                                          str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                          for(var putrt1 in this.schemas[rtschput1].properties){
                                            str+="|"+putrt1+"|"
                                            if(this.schemas[rtschput1].properties[putrt1].type){
                                              str+=this.schemas[rtschput1].properties[putrt1]+"|"
                                            }
                                            else if(this.schemas[rtschput1].properties[putrt1].$ref){
                                              str+="object|"
                                            }
                                            else if(this.schemas[rtschput1].properties[putrt1].items.$ref){
                                              str+="array|"
                                            }
                                            else{
                                              str+=" |"
                                            }
                                            if(this.schemas[rtschput1].properties[putrt1].description){
                                              str+=this.schemas[rtschput1].properties[putrt1].description+"|"+"\n"
                                            }
                                            else{
                                              str+="|"+"\n"
                                            }
                                          }
                                        }
                                        else{
                                          str+=this.schemas[rtschput1].description+"\n\n"
                                          if(this.schemas[rtschput1].type){
                                            str+=this.schemas[rtschput1].type+"\n"
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                                for(var pro1put3 in this.schemas[schput].properties){
                                  if(this.schemas[schput].properties[pro1put3].items){
                                    if(this.schemas[schput].properties[pro1put3].items.$ref){
                                    for(var rtschput3 in this.schemas){
                                      if(this.schemas[schput].properties[pro1put3].items.$ref.includes(rtschput3)){
                                        str+="\n"+"* 返回数组"+proput+"："
                                        if(this.schemas[rtschput3].properties){
                                        //   if(this.schemas[rtschput3].description){
                                        //   str+=this.schemas[rtschput3].description
                                        // }
                                          str+="\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                          for(var putrt3 in this.schemas[rtschput3].properties){
                                            str+="|"+putrt3+"|"
                                            if(this.schemas[rtschput3].properties[putrt3].type){
                                              str+=this.schemas[rtschput3].properties[putrt3]+"|"
                                            }
                                            else if(this.schemas[rtschput3].properties[putrt3].$ref){
                                              str+="object|"
                                            }
                                            else if(this.schemas[rtschput3].properties[putrt3].items.$ref){
                                              str+="array|"
                                            }
                                            else{
                                              str+=" |"
                                            }
                                            if(this.schemas[rtschput3].properties[putrt3].description){
                                              str+=this.schemas[rtschput3].properties[putrt3].description+"|"+"\n"
                                            }
                                            else{
                                              str+="|"+"\n"
                                            }
                                          }
                                        }
                                        else{
                                          str+=this.schemas[rtschput3].description+"\n\n"
                                          if(this.schemas[rtschput3].type){
                                            str+=this.schemas[rtschput3].type+"\n"
                                          }
                                        }
                                      }
                                    }
                                  }
                                  }
                                }
                                
                              }
                            }

                           }
                         }
                       }
                     }
                   }
                 }str+="\n"+"-----"+"\n"

               }
            }

            // 遍历delete请求

            if(this.paths[forpaths].delete){
              if(this.paths[forpaths].delete.tags==this.tags[item].name ){
                 str+="\n\n"+"### 接口地址："+forpaths+"\n\n"+"* **请求方式：delete**"+"\n\n"
                 if(this.paths[forpaths].delete.summary){
                   str+="* **接口功能："+this.paths[forpaths].delete.summary+"**"+"\n\n"
                 }
                  if(this.paths[forpaths].delete.parameters){
                    str+="* **请求参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                    for(var partdel in this.paths[forpaths].delete.parameters){
                      if(this.paths[forpaths].delete.parameters[partdel].name){str+="|"+this.paths[forpaths].delete.parameters[partdel].name+"|"}
                      if(this.paths[forpaths].delete.parameters[partdel].schema.type){str+=this.paths[forpaths].delete.parameters[partdel].schema.type+"|"}
                      else if(this.paths[forpaths].delete.parameters[partdel].schema.$ref){str+="object|"}
                      else if(this.paths[forpaths].delete.parameters[partdel].schema.items.$ref){str+="object|"}
                      else{str+=" |"}
                      if(this.paths[forpaths].delete.parameters[partdel].required){str+=this.paths[forpaths].delete.parameters[partdel].required+"|"}
                      else{str+="false|"}
                      if(this.paths[forpaths].delete.parameters[partdel].description){str+=this.paths[forpaths].delete.parameters[partdel].description+"|"+"\n"}
                      else{str+=" |"+"\n"}
                    }
                    for(var askrefdel in this.paths[forpaths].delete.parameters){
                      if(this.paths[forpaths].delete.parameters[askrefdel].schema.$ref){
                        for(var askschdel in this.schemas){
                          if(this.paths[forpaths].delete.parameters[askrefdel].schema.$ref.includes(askschdel)){
                            str+="\n"+"* 对象："
                            if(this.schemas[askschdel].properties){
                              console.log("111")
                            }
                            else{
                              str+=this.schemas[askschdel].description+"\n\n"+"* \xa0\xa0\xa0\xa0* 类型："+this.schemas[askschdel].type+"\n"
                            }
                          }
                        }
                      }

                    }
                    for(var askrefdel1 in this.paths[forpaths].delete.parameters){
                      if(this.paths[forpaths].delete.parameters[askrefdel1].schema.items){
                      if(this.paths[forpaths].delete.parameters[askrefdel1].schema.items.$ref){
                        for(var askschdel1 in this.schemas){
                          if(this.paths[forpaths].delete.parameters[askrefdel1].schema.items.$ref.includes(askschdel1)){
                            str+="\n"+"* 数组："
                            if(this.schemas[askschdel1].properties){
                              console.log("111")
                            }
                            else{
                              str+=this.schemas[askschdel1].description+"\n\n"+"\xa0\xa0\xa0\xa0* 类型："+this.schemas[askschdel1].type+"\n"
                            }
                          }
                        }
                      }
                      }
                    }
                  }
                  if(this.paths[forpaths].delete.responses){
                    for(var resdel in this.paths[forpaths].delete.responses){
                      if(this.paths[forpaths].delete.responses[resdel].content){
                        for(var contdel in this.paths[forpaths].delete.responses[resdel].content){
                          if(contdel=="text/json"){
                            if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.items){
                              if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.items.$ref){
                                for(var sch1del in this.schemas){
                                  if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.items.$ref.includes(sch1del)){
                                    str+="\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n\n"+"|--------| --------| --------|"+"\n"
                                    for(var pro1del in this.schemas[sch1del].properties){
                                      //  if(!this.schemas[sch1del].properties[pro1del].$ref){
                                         str+="|"+pro1del+"|"
                                         if(this.schemas[sch1del].properties[pro1del].type){
                                           str+=this.schemas[sch1del].properties[pro1del].type+"|"
                                         }
                                         else if(this.schemas[sch1del].properties[pro1del].$ref){
                                           str+="project|"
                                         }
                                         else if(this.schemas[sch1del].properties[pro1del].items.$ref){
                                           str+="array|"
                                         }
                                         else{str+=" |"}
                                         if(this.schemas[sch1del].properties[pro1del].description){
                                           str+=this.schemas[sch1del].properties[pro1del].description+"|"+"\n"
                                         }
                                          else{str+=" |"+"\n"}
                                      //  }
                                    }
                                    for(var pro1delrt in this.schemas[sch1del].properties){
                                      if(this.schemas[sch1del].properties[pro1delrt].$ref){
                                        for(var rtschdel in this.schemas){
                                          if(this.schemas[sch1del].properties[pro1delrt].$ref.includes(rtschdel)){
                                            str+="\n"+"* 返回对象"+pro1delrt+"："
                                            if(this.schemas[rtschdel].properties){
                                              console.log("111113232")
                                            }
                                            else{
                                              str+=this.schemas[sch1del].description+"\n\n"
                                              if(this.schemas[sch1del].type){
                                                str+=this.schemas[sch1del].type+"\n"
                                              }
                                            }
                                          }
                                        }

                                      }
                                    }
                                    for(var pro1delrt1 in this.schemas[sch1del].properties){
                                      if(this.schemas[sch1del].properties[pro1delrt1].items.$ref){
                                        for(var rtschdel1 in this.schemas){
                                          if(this.schemas[sch1del].properties[pro1delrt1].items.$ref.includes(rtschdel1)){
                                            str+="\n"+"* 返回数组"+pro1delrt1+"："
                                            if(this.schemas[rtschdel1].properties){
                                              console.log("111113232")
                                            }
                                            else{
                                              str+=this.schemas[sch1del].description+"\n\n"
                                              if(this.schemas[sch1del].type){
                                                str+=this.schemas[sch1del].type+"\n"
                                              }
                                            }
                                          }
                                        }

                                      }
                                    }

                                  }

                                }
                              }
                            }
                             if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.$ref){
                               for(var schdel in this.schemas){
                                 if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.$ref.includes(schdel)){
                                    str+="\n"+"* **返回参数说明：**"+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n\n"+"|--------| --------| --------|"+"\n"
                                    for(var prodel in this.schemas[schdel].properties){
                                      // if(!this.schemas[schdel].properties[prodel].$ref){
                                        str+="|"+prodel+"|"
                                        if(this.schemas[schdel].properties[prodel].type){
                                          str+=this.schemas[schdel].properties[prodel].type+"|"
                                        }
                                        else if(this.schemas[schdel].properties[pro1del].$ref){
                                           str+="project|"
                                         }
                                         else if(this.schemas[schdel].properties[pro1del].items.$ref){
                                           str+="array|"
                                         }
                                        else{str+=" |"}
                                        if(this.schemas[schdel].properties[prodel].description){
                                          str+=this.schemas[schdel].properties[prodel].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}

                                      // }

                                    }
                                    for(var pro1delrt2 in this.schemas[sch1del].properties){
                                      if(this.schemas[sch1del].properties[pro1delrt2].$ref){
                                        for(var rtschdel2 in this.schemas){
                                          if(this.schemas[sch1del].properties[pro1delrt2].$ref.includes(rtschdel2)){
                                            str+="\n"+"* 返回对象"+pro1delrt2+"："
                                            if(this.schemas[rtschdel2].properties){
                                              console.log("111113232")
                                            }
                                            else{
                                              str+=this.schemas[sch1del].description+"\n\n"
                                              if(this.schemas[sch1del].type){
                                                str+=this.schemas[sch1del].type+"\n"
                                              }
                                            }
                                          }
                                        }

                                      }
                                    }
                                    for(var pro1delrt3 in this.schemas[sch1del].properties){
                                      if(this.schemas[sch1del].properties[pro1delrt3].$ref){
                                        for(var rtschdel3 in this.schemas){
                                          if(this.schemas[sch1del].properties[pro1delrt3].$ref.includes(rtschdel3)){
                                            str+="\n"+"* 返回数组"+pro1delrt3+"："
                                            if(this.schemas[rtschdel3].properties){
                                              console.log("111113232")
                                            }
                                            else{
                                              str+=this.schemas[sch1del].description+"\n\n"
                                              if(this.schemas[sch1del].type){
                                                str+=this.schemas[sch1del].type+"\n"
                                              }
                                            }
                                          }
                                        }

                                      }
                                    }
                                 }
                                 
                               }

                             }
                          }
                        }
                      }
                    }
                  }str+="\n"+"-----"+"\n"
              }
            }
          }
        }
        // console.log(str)
        this.content=str
        return str;
      }
    },
}
</script>
<style>

</style>
