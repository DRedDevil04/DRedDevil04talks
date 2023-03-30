
 	let date=new Date();
 	let blog_date_text="The following blog was written at "+date.getHours()+":"+date.getMinutes()+" am"+" on "+date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+".";
 	document.getElementById("blog_date").innerHTML= blog_date_text;
 	// const api_url = 
  //     "http://127.0.0.1:3001";
      
  //   async function getapi(url) {
    
       
  //       const response = await fetch(url);
        
  //       console.log(response);
  //       var data = await response.json();

  //       console.log(data);
        
        
  //       document.getElementById("blog").innerHTML= data[0].blogContent;
  //   }
  //   // Calling that async function
  //   getapi(api_url);
  
    