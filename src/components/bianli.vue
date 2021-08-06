<template>
    <div class="All">
    <div v-if="json.info"><h2>
  ## {{json.info.title}}
</h2>
<div v-if="json.info">
{{json.openapi}} {{json.info.version}}
</div>
</div>
<ul v-if="paths">
  <li v-for="(item,index) in tags" :key="index">
    <h3>- ### {{item.name}}{{item.description}}</h3>
   <ul v-for="(forpaths,key,index1) in paths" :key="index1" >
     <!-- 遍历get请求方式 -->
     <div v-if="forpaths.get">
      <li v-if="forpaths.get.tags.includes(item.name)">
        <b>**接口地址{{key}}**</b>
      <br><b>**请求方式：get**</b>
         <div v-if="forpaths.get.summary">**接口名称summary：{{forpaths.get.summary}}**</div>
        <ul>
          <div v-if="forpaths.get.parameters">请求参数说明：<br>
          | 参数名称 | 类型 | 必填 | 参数说明|<br>
          |--------| --------| --------| --------|
           <div v-for="(part,key,index2) in forpaths.get.parameters" :key="index2">             
             <span v-if="part.name">|{{part.name}}|</span>
             <span v-if="part.schema.type">{{part.schema.type}}|</span>
             <span v-else> |</span>
             <span v-if="part.required">{{part.required}}|</span>
             <span v-else>false|</span>
             <span v-if="part.description">{{part.description}}|</span>             
           </div>
          </div>
          <div v-if="forpaths.get.responses">返回参数说明：<br>
            <span v-for="(res,key,index2) in forpaths.get.responses" :key="index2">
               
               <span v-if="res.content">
                 
            | 参数名称 | 类型 | 参数说明|<br>
            |--------| --------| --------|<br>
                 <span v-for="(cont,key,index3) in res.content" :key="index3">
                   <span v-if="index3<1">
                   <span v-if="cont.schema.$ref">
                     <span v-for="(sch,key,index4) in schemas" :key="index4">
                       <span v-if="cont.schema.$ref.includes(key)">
                         <div v-for="(pro,key,index5) in sch.properties" :key="index5">                          
                           <div v-if="pro.$ref"></div>
                           <span v-else>
                             |{{key}}|
                             <span v-if="pro.type">{{pro.type}}|</span>
                             <span v-else> |</span>
                             <span v-if="pro.description">{{pro.description}}|</span>
                             <span v-else> |</span>
                           </span>  
                         </div>
                         <div v-for="(pro,key,index5) in sch.properties" :key="'abc'+index5"> 
                           1111                         
                           <div v-if="pro.$ref">
                             121312321
                             </div>  
                         </div>
                       </span>
                     </span> 
                   </span>
                   <span v-if="cont.schema.items"><br>{{cont.schema.items.$ref}}</span>
                   </span>
                 </span>
               </span>
            </span>

          </div>
        </ul>
       </li>
     </div>
     <!-- 遍历post请求方式 -->
     <div v-if="forpaths.post">
       <li v-if="forpaths.post.tags.includes(item.name)">
         <b>**接口地址：{{key}}**</b><br>
        <b>**post**</b>
        <div v-if="forpaths.post.summary">**接口名称summary : {{forpaths.post.summary}}**</div>
        <ul> 
          <div v-if="forpaths.post.requestBody">
              | 参数名称 | 类型 | 必填 | 参数说明|<br>
            |--------| --------| --------| --------|
           <li v-for="(request,key,index2) in forpaths.post.requestBody" :key="index2">
              
             <div v-for="(res,key,index3) in request" :key="index3">
               |{{key}}| 
               
               </div>     
               <span v-if="key==='description'">{{forpaths.post.requestBody.description}}</span> 
               <!-- 参数说明-->
          </li>
          </div>   
          <div v-if="forpaths.post.responses">
            <b>**responses:**</b>
            <li v-for="(res,key,index2) in forpaths.post.responses" :key="index2">
               &nbsp;&nbsp;- {{key}}:<br>
               description : {{res.description}}
               <div v-if="res.content">
                 <div v-for="(cont,key,index3) in res.content" :key="index3">
                   {{key}} : 
                   <div v-for="(sche,key,index4) in cont.schema" :key="index4"> 
                     <div>{{key}} :{{sche}}</div>
                   </div>
                 </div>
               </div>
            </li>
          </div>      
        </ul> 
        
       </li>
     </div>
     <!-- 遍历put请求方式 -->
     <div v-if="forpaths.put">
       <li v-if="forpaths.put.tags.includes(item.name)">
         <b>**{{key}}**</b><br>
         <b>**put**</b>
         <div v-if="forpaths.put.summary">summary : {{forpaths.put.summary}}</div>
         <ul><div v-if="forpaths.put.requestBody">
           <li v-for="(request,key,index2) in forpaths.put.requestBody" :key="index2">
            &nbsp;&nbsp;-  {{key}}: <span v-if="key==='description'">{{forpaths.put.requestBody.description}}</span>
             <div v-for="(res,key,index3) in request" :key="index3">
               <div v-if="res.schema">
               {{key}} :<br>
               $ref:{{res.schema.$ref}}
               </div>  
               </div>       
          </li>
          <div v-if="forpaths.put.responses">
            <b>**responses:**</b>
            <li v-for="(res,key,index2) in forpaths.post.responses" :key="index2">
               &nbsp;&nbsp;- {{key}}:<br>
               description : {{res.description}}
               <div v-if="res.content">
                 <div v-for="(cont,key,index3) in res.content" :key="index3">
                   {{key}} : 
                   <div v-for="(sche,key,index4) in cont.schema" :key="index4">
                    
                     <div>{{key}} :{{sche}}</div>
                   </div>
                 </div>
               </div>
            </li>
          </div>
          </div> 

         </ul>

       </li>
     </div>
     <!-- 遍历delete请求方式 -->
     <div v-if="forpaths.delete">
      <li v-if="forpaths.delete.tags.includes(item.name)">
        <b>**{{key}}**</b>
      <br><b>**delete**</b>
         <div v-if="forpaths.delete.summary">summary : {{forpaths.delete.summary}}</div>
        <ul>
          <div v-if="forpaths.delete.parameters">
           <li v-for="(part,key,index2) in forpaths.delete.parameters" :key="index2">             
             &nbsp;&nbsp;- <span v-if="part.name">Name : {{part.name}}</span>
             <div v-if="part.in">in : {{part.in}}</div>
             <div v-if="part.description">description : {{part.description}}</div>
             <div v-if="part.required">required : {{part.required}}</div>
             <div v-for="(sch,key,index5) in part.schema" :key="index5">
                     <div v-if="sch.$ref">{{key}} :$ref:{{sch.$ref}}</div>
                     <div v-else>{{key}}:{{sch}}</div>
                </div>
          </li>
          </div>
          <div v-if="forpaths.delete.responses">
            <b>**responses:**</b>
            <li v-for="(res,key,index2) in forpaths.delete.responses" :key="index2">
               &nbsp;&nbsp;- {{key}}:<br>
               description : {{res.description}}
               <div v-if="res.content">
                 <div v-for="(cont,key,index3) in res.content" :key="index3">
                  {{key}} : 
                   <div v-for="(sche,key,index4) in cont.schema" :key="index4">
                     <div v-if="sche.$ref">{{key}} : $ref : {{sche.$ref}}</div>
                     <div v-else>{{key}} : {{sche}}</div>
                   </div>
                 </div>
               </div>
            </li>
          </div>
        </ul>
        
       </li>
     </div>
   </ul>
  </li>
</ul>
    </div>
</template>
<script>
export default {
    
    props:['tags','json','paths','schemas']
}
</script>