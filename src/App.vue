<template>
<div>
  <!-- <button @click="switchJs()">switch</button> -->
<!-- <button @click="handclick()">anxios</button> -->
<div style="width: 1500px;height: 850px;">
  <div style="width: 40%;height: 850px;float:left;display: inline-block;">
    <h3>输入json字符串<button @click="show" >转换成markdown</button></h3>
  <textarea v-model="text" style="height: 850px;width: 90%;"></textarea>
  </div>
   <div style="width: 60%;float:left;display: inline-block;height: 850px;">
    <markdown-it-vue class="md-body" :content="content"/>
  </div>
</div>
 

<!-- <bianli :tags="tags"  :json="json" :paths="paths" :schemas="schemas"></bianli> -->
</div>
<!-- <div>
   <VueMarkdown :source="content"></VueMarkdown>
  </div> -->

</template>
<script>
import Vue from 'vue'//引入vue
import axios from 'axios'//引入axios
import marked from 'marked'
// import VueMarkdown from 'vue-markdown'

import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'

// import bianli from './components/bianli.vue'
Vue.component("axios",axios);

export default {
  components: {
    MarkdownItVue
  },
  // components: { bianli },
  data(){
    return{
      
      html:"",
      text:"",
      tags:[],
      json:[],
      paths:[],
      schemas:[],
      Data:[],
      content: ''
    }
  },
    methods:{
      compiledMarkdown: function() {
      return marked(this.str, {});//第一个参数是你的markdown文本 第二个参数是选项
    },
      // switchJs(){
      //   this.Data=JSON.parse(this.text);
      //   this.tags=this.Data.tags
      //   this.json=this.Data
      //   this.paths=this.Data.paths
      //   this.schemas=this.Data.components.schemas
      //   // console.log(this.paths)

      // },
      
      handclick(){
      axios.get('swagger/project_api/swagger.json').then(res=>
      {
         console.log("already")
        this.tags=res.data.tags
        this.json=res.data
        this.paths=res.data.paths
        this.schemas=res.data.components.schemas
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

        str +="## "+this.json.info.title+"\n"
        str +=this.json.openapi+"\xa0"+this.json.info.version+"\n"
        for (var item in this.tags){
          str+="\n"+"### "+this.tags[item].description+"\xa0"+this.tags[item].name+"\n"
          for(var forpaths in this.paths){

            // 遍历get请求

            if(this.paths[forpaths].get){
              if(this.paths[forpaths].get.tags==this.tags[item].name ){
                str+="\n"+"**接口地址："+forpaths+"**"+"\n\n"+"**请求方式：get**"+"\n\n"
                if(this.paths[forpaths].get.summary){
                  str+="**接口名称summary："+this.paths[forpaths].get.summary+"**"+"\n\n"
                }
                if(this.paths[forpaths].get.parameters){
                  str+="请求参数说明："+"\n\n"+"| 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                  for(var part in this.paths[forpaths].get.parameters){
                  
                    if(this.paths[forpaths].get.parameters[part].name){str+="|"+this.paths[forpaths].get.parameters[part].name+"|"}
                    if(this.paths[forpaths].get.parameters[part].schema.type){str+=this.paths[forpaths].get.parameters[part].schema.type+"|"}
                    else if(this.paths[forpaths].get.parameters[part].schema.$ref){str+="object|"}
                    else if(this.paths[forpaths].get.parameters[part].schema.items.$ref){str+="object|"}
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
                          str+="\n"+"对象："
                          if(this.schemas[askschget].properties){
                            // console.log(this.schemas[askschget].description)
                            str+=this.schemas[askschget].description+"\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var pro1ask in this.schemas[askschget].properties){
                               if(!this.schemas[askschget].properties[pro1ask].$ref){
                                 str+="|"+pro1ask+"|"
                                 if(this.schemas[askschget].properties[pro1ask].type){
                                   str+=this.schemas[askschget].properties[pro1ask].type+"|"
                                 }
                                 else{str+=" |"}
                                 if(this.schemas[askschget].properties[pro1ask].description){
                                   str+=this.schemas[askschget].properties[pro1ask].description+"|"+"\n"
                                 }
                                 else{str+=" |"+"\n"}
                               }

                            }
                          }
                          else{
                            str+=this.schemas[askschget].description+"\n\n"+"类型："+this.schemas[askschget].type+"\n"

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
                                  str+="\n"+"返回参数说明："+"\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                  for(var pro1 in this.schemas[sch1].properties){
                                    if(!this.schemas[sch1].properties[pro1].$ref){
                                       str+="|"+pro1+"|"
                                     if(this.schemas[sch1].properties[pro1].type){
                                       str+=this.schemas[sch1].properties[pro1].type+"|"
                                        }
                                       else{str+=" |"}
                                     if(this.schemas[sch1].properties[pro1].description){
                                        str+=this.schemas[sch1].properties[pro1].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}
                                     }

                                  }
                                }
                              }
                            }
                          }
                      if(this.paths[forpaths].get.responses[res].content[cont].schema.$ref){
                        for(var sch in this.schemas){
                          if(this.paths[forpaths].get.responses[res].content[cont].schema.$ref.includes(sch)){
                             str+="\n"+"返回参数说明："+"\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var pro in this.schemas[sch].properties){
                              if(!this.schemas[sch].properties[pro].$ref){
                                str+="|"+pro+"|"
                                if(this.schemas[sch].properties[pro].type){
                                  str+=this.schemas[sch].properties[pro].type+"|"
                                }
                                else{str+=" |"}
                                if(this.schemas[sch].properties[pro].description){
                                  str+=this.schemas[sch].properties[pro].description+"|"+"\n"
                                }
                                else{str+=" |"+"\n"}
                              }
                              // if(this.schemas[sch].properties[pro].$ref){
                              //   str+="返回对象:"+this.schemas[sch].description+"\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                              //   if(this.schemas[sch].properties[pro].$ref.includes(sch)){
                              //     for(var obj in this.schemas[sch].properties){
                              //       str+="|"+obj+"|"
                              //   if(this.schemas[sch].properties[obj].type){
                              //     str+=this.schemas[sch].properties[obj].type+"|"
                              //   }
                              //   else{str+=" |"}
                              //   if(this.schemas[sch].properties[obj].description){
                              //     str+=this.schemas[sch].properties[obj].description+"|"+"\n"
                              //   }
                              //   else{str+=" |"+"\n"}
                              //     }
                              //   }
                              // }

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

            // 遍历post请求

            if(this.paths[forpaths].post){
              if(this.paths[forpaths].post.tags==this.tags[item].name ){
                str+="\n\n"+"**接口地址："+forpaths+"**"+"\n\n"+"**请求方式：post**"+"\n\n"
                if(this.paths[forpaths].post.summary){
                  str+="**接口名称summary："+this.paths[forpaths].post.summary+"**"+"\n\n"
                }
                if(this.paths[forpaths].post.requestBody){
                  if(this.paths[forpaths].post.requestBody.description){
                    str+="description"+this.paths[forpaths].post.requestBody.description+"\n\n"
                  }
                  str+="请求参数说明："+"\n\n"+ " | 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                  
                  for(var rebody in this.paths[forpaths].post.requestBody.content){
                    if(rebody=="text/json"){
                      if(this.paths[forpaths].post.requestBody.content[rebody].schema.$ref){
                        // console.log(this.paths[forpaths].post.requestBody.content[rebody].schema.$ref)
                        for(var sch2 in this.schemas){
                                if(this.paths[forpaths].post.requestBody.content[rebody].schema.$ref.includes(sch2)){
                                  for(var pro2 in this.schemas[sch2].properties){
                                    if(!this.schemas[sch2].properties[pro2].$ref){
                                       str+="|"+pro2+"|"
                                     if(this.schemas[sch2].properties[pro2].type){
                                       str+=this.schemas[sch2].properties[pro2].type+"|"
                                        }
                                       else{str+=" |"}
                                       if(this.schemas[sch2].required){
                                         for(var req in this.schemas[sch2].required){
                                           if(this.schemas[sch2].required[req]==pro2){
                                             str+="true|"
                                           }
                                           else{
                                           str+="false|"
                                        }
                                         }
                                       }
                                       else{str+="false|"}
                                       
                                                                                 
                                     if(this.schemas[sch2].properties[pro2].description){
                                        str+=this.schemas[sch2].properties[pro2].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}
                                     }
                                    if(this.schemas[sch2].properties[pro2].$ref){
                                      for(var sch2ref in this.schemas){
                                        if(this.schemas[sch2].properties[pro2].$ref.includes(sch2ref)){
                                          str+="\n"+"对象："
                                          if(this.schemas[sch2ref].properties){
                                            if(this.schemas[sch2ref].description){
                                            str+=this.schemas[sch2ref].description+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                          }
                                          for(var pro2ask in this.schemas[sch2ref].properties){
                                            str+="|"+pro2ask+"|"
                                            if(this.schemas[sch2ref].properties[pro2ask].type){
                                              str+=this.schemas[sch2ref].properties[pro2ask].type+"|"
                                            }
                                            else{str+=" |"}
                                            if(this.schemas[sch2ref].properties[pro2ask].description){
                                              str+=this.schemas[sch2ref].properties[pro2ask].description+"|"+"\n"
                                            }
                                            else{str+=" |"+"\n"}
                                          }
                                          }
                                          else{
                                            str+=this.schemas[sch2ref].description+"\n\n"+"类型："+this.schemas[sch2ref].type+"\n"
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
                                  str+="\n\n"+"返回参数说明："+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                  for(var prop1 in this.schemas[schp1].properties){
                                    if(!this.schemas[schp1].properties[prop1].$ref){
                                       str+="|"+prop1+"|"
                                     if(this.schemas[schp1].properties[prop1].type){
                                       str+=this.schemas[schp1].properties[prop1].type+"|"
                                        }
                                       else{str+=" |"}
                                     if(this.schemas[schp1].properties[prop1].description){
                                        str+=this.schemas[schp1].properties[prop1].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}
                                     }

                                  }
                                }
                              }
                             }
                            if(this.paths[forpaths].post.responses[resp].content[contp].schema.$ref){
                        for(var schp in this.schemas){
                          if(this.paths[forpaths].post.responses[resp].content[contp].schema.$ref.includes(schp)){
                             str+="\n\n"+"返回参数说明："+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                            for(var prop in this.schemas[schp].properties){
                              if(!this.schemas[schp].properties[prop].$ref){
                                str+="|"+prop+"|"
                                if(this.schemas[schp].properties[prop].type){
                                  str+=this.schemas[schp].properties[prop].type+"|"
                                }
                                else{str+=" |"}
                                if(this.schemas[schp].properties[prop].description){
                                  str+=this.schemas[schp].properties[prop].description+"|"+"\n"
                                }
                                else{str+=" |"+"\n"}
                              }
                              // if(this.schemas[sch].properties[pro].$ref){
                              //   str+="返回对象:"+this.schemas[sch].description+"\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                              //   if(this.schemas[sch].properties[pro].$ref.includes(sch)){
                              //     for(var obj in this.schemas[sch].properties){
                              //       str+="|"+obj+"|"
                              //   if(this.schemas[sch].properties[obj].type){
                              //     str+=this.schemas[sch].properties[obj].type+"|"
                              //   }
                              //   else{str+=" |"}
                              //   if(this.schemas[sch].properties[obj].description){
                              //     str+=this.schemas[sch].properties[obj].description+"|"+"\n"
                              //   }
                              //   else{str+=" |"+"\n"}
                              //     }
                              //   }
                              // }

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

            // 遍历put请求

            if(this.paths[forpaths].put){
               if(this.paths[forpaths].put.tags==this.tags[item].name ){
                 str+="\n"+"**接口地址："+forpaths+"**"+"\n\n"+"**请求方式：put**"+"\n\n"
                 if(this.paths[forpaths].put.summary){
                  str+="**接口名称summary："+this.paths[forpaths].put.summary+"**"+"\n\n"
                 }
                 if(this.paths[forpaths].put.requestBody){
                    if(this.paths[forpaths].put.requestBody.description){
                      str+="description："+this.paths[forpaths].put.requestBody.description+"\n\n"
                    }
                     str+="请求参数说明："+"\n\n"+ " | 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
                     for(var rebodyput in this.paths[forpaths].put.requestBody.content){
                       if(rebodyput=="text/json"){
                         if(this.paths[forpaths].put.requestBody.content[rebodyput].schema.$ref){
                           for(var sch2put in this.schemas){
                             if(this.paths[forpaths].put.requestBody.content[rebodyput].schema.$ref.includes(sch2put)){
                               for(var pro2put in this.schemas[sch2put].properties){
                                 if(!this.schemas[sch2put].properties[pro2put].$ref){
                                   str+="|"+pro2put+"|"
                                   if(this.schemas[sch2put].properties[pro2put].type){
                                     str+=this.schemas[sch2put].properties[pro2put].type+"|"
                                   }
                                   else{str+=" |"}
                                   if(this.schemas[sch2put].required){
                                     for(var reqput in this.schemas[sch2put].required){
                                        if(this.schemas[sch2put].required[reqput]==pro2put){
                                          str+="ture|"
                                        }
                                        else{
                                           str+="false|"
                                        }
                                     }

                                   }else{str+="false|"}
                                   if(this.schemas[sch2put].properties[pro2put].description){
                                     str+=this.schemas[sch2put].properties[pro2put].description+"|"+"\n"
                                   }
                                   else{str+=" |"+"\n"}
                                 }

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
                                   str+="\n"+"返回参数说明："+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                   for(var proput1 in this.schemas[schput1].properties){
                                     if(!this.schemas[schput1].properties[proput1].$ref){
                                       str+="|"+proput1+"|"
                                       if(this.schemas[schput1].properties[proput1].type){
                                         str+=this.schemas[schput1].properties[proput1].type+"|"
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
                                     }
                                   }
                                 }

                               }
                             }
                           }
                           if(this.paths[forpaths].post.responses[resput].content[contput].schema.$ref){
                            for(var schput in this.schemas){
                              if(this.paths[forpaths].put.responses[resput].content[contput].schema.$ref.includes(schput)){
                                str+="\n"+"返回参数说明："+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n"+"|--------| --------| --------|"+"\n"
                                for(var proput in this.schemas[schput].properties){
                                  if(!this.schemas[schput].properties[proput].$ref){
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

            // 遍历delete请求

            if(this.paths[forpaths].delete){
              if(this.paths[forpaths].delete.tags==this.tags[item].name ){
                 str+="\n\n"+"**接口地址："+forpaths+"**"+"\n\n"+"**请求方式：delete**"+"\n\n"
                 if(this.paths[forpaths].delete.summary){
                   str+="**接口名称summary："+this.paths[forpaths].delete.summary+"**"+"\n"
                 }
                  if(this.paths[forpaths].delete.parameters){
                    str+="请求参数说明："+"\n\n"+"| 参数名称 | 类型 | 必填 | 参数说明|"+"\n"+"|--------| --------| --------| --------|"+"\n"
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
                            str+="\n"+"对象："
                            if(this.schemas[askschdel].properties){
                              console.log("111")
                            }
                            else{
                              str+=this.schemas[askschdel].description+"\n\n"+"类型："+this.schemas[askschdel].type+"\n"
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
                                    str+="\n"+"返回参数说明："+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n\n"+"|--------| --------| --------|"+"\n"
                                    for(var pro1del in this.schemas[sch1del].properties){
                                       if(!this.schemas[sch1del].properties[pro1del].$ref){
                                         str+="|"+pro1del+"|"
                                         if(this.schemas[sch1del].properties[pro1del].type){
                                           str+=this.schemas[sch1del].properties[pro1del].type+"|"
                                         }
                                         else{str+=" |"}
                                         if(this.schemas[sch1del].properties[pro1del].description){
                                           str+=this.schemas[sch1del].properties[pro1del].description+"|"+"\n"
                                         }
                                          else{str+=" |"+"\n"}
                                       }
                                    }
                                  }

                                }
                              }
                            }
                             if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.$ref){
                               for(var schdel in this.schemas){
                                 if(this.paths[forpaths].delete.responses[resdel].content[contdel].schema.$ref.includes(schdel)){
                                    str+="\n"+"返回参数说明："+"\n\n"+"| 参数名称 | 类型 | 参数说明|"+"\n\n"+"|--------| --------| --------|"+"\n"
                                    for(var prodel in this.schemas[schdel].properties){
                                      if(!this.schemas[schdel].properties[prodel].$ref){
                                        str+="|"+prodel+"|"
                                        if(this.schemas[schdel].properties[prodel].type){
                                          str+=this.schemas[schdel].properties[prodel].type+"|"
                                        }
                                        else{str+=" |"}
                                        if(this.schemas[schdel].properties[prodel].description){
                                          str+=this.schemas[schdel].properties[prodel].description+"|"+"\n"
                                        }
                                        else{str+=" |"+"\n"}

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
        console.log(str)
        // this.html = require('marked')(str)
        
        this.content=str
        return str;


      }
     
      
    },
 
    
}
</script>
<style>

</style>
