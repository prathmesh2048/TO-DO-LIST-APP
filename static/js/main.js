
setTimeout( function(){document.getElementsByClassName('alert')[0].hide();} , 1000);
        function getCookie(name) {
		    var cookieValue = null;
		    if (document.cookie && document.cookie !== '') {
		        var cookies = document.cookie.split(';');
		        for (var i = 0; i < cookies.length; i++) {
		            var cookie = cookies[i].trim();
		            // Does this cookie string begin with the name we want?
		            if (cookie.substring(0, name.length + 1) === (name + '=')) {
		                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                break;
		            }
		        }
		    }
		    return cookieValue;
		}

		var csrftoken = getCookie('csrftoken');
		var activeItem = null;
		var list_snapshot = [];

		buildList();

		function buildList(){
			var wrapper = document.getElementById('list-wrapper')
			var url = 'http://127.0.0.1:8000/api/task-list/'

			fetch(url)
			.then((resp) => resp.json())
			.then(function(data){
				console.log('Data:', data)

				var list = data
				for (var i in list){


					try{
						document.getElementById(`data-row-${i}`).remove()
					}catch(err){

					}
			


					var title = `<span class="title">${list[i].title}</span>`
					if (list[i].completed == true){
						title = `<strike class="title">${list[i].title}</strike>`
					}

					var item = `
						<div id="data-row-${i}" class="task-wrapper flex-wrapper">
							<div style="flex:7">
								${title}
							</div>
							<div style="flex:1">
								<button class="btn btn-sm btn-outline-info edit">Edit </button>
							</div>
							<div style="flex:1">
								<button class="btn btn-sm btn-outline-dark delete">-</button>
							</div>
						</div>

					`
					wrapper.innerHTML += item
	
				}

				if (list_snapshot.length > list.length){
					for (var i = list.length; i < list_snapshot.length; i++){
						document.getElementById(`data-row-${i}`).remove()
					}
				}

				list_snapshot = list


				for (var i in list){
					var editBtn = document.getElementsByClassName('edit')[i]
					var deleteBtn = document.getElementsByClassName('delete')[i]
					var title = document.getElementsByClassName('title')[i]


					editBtn.addEventListener('click', (function(item){
						return function(){
							editItem(item)
						}
					})(list[i]))


					deleteBtn.addEventListener('click', (function(item){
						return function(){
							deleteItem(item)
						}
					})(list[i]))



					
					title.addEventListener('click', (function(item){
						return function(){
							strikeUnstrike(item)
						}
					})(list[i]))


				}


			})
		}


		var form = document.getElementById('form-wrapper')
		form.addEventListener('submit', function(e){
			e.preventDefault()
			console.log('Form submitted')
			var url = 'http://127.0.0.1:8000/api/task-create/'
			if (activeItem != null){
				var url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
				activeItem = null
			}



			var title = document.getElementById('title').value
			fetch(url, {
				method:'POST',
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				},
				body:JSON.stringify({'title':title})
			}
			).then(function(response){
				buildList()
				document.getElementById('form').reset()
			})
		})




		function editItem(item){
			console.log('Item clicked:', item)
			activeItem = item
			document.getElementById('title').value = activeItem.title
		}


		function deleteItem(item){
			console.log('Delete clicked')
			fetch(`http://127.0.0.1:8000/api/task-delete/${item.id}/`, {
				method:'DELETE', 
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				}
			}).then((response) => {
				buildList()
			})
		}

		function strikeUnstrike(item){
			console.log('Strike clicked')

			item.completed = !item.completed
			fetch(`http://127.0.0.1:8000/api/task-update/${item.id}/`, {
				method:'POST', 
				headers:{
					'Content-type':'application/json',
					'X-CSRFToken':csrftoken,
				},
				body:JSON.stringify({'title':item.title, 'completed':item.completed})
			}).then((response) => {
				buildList()
			})
		}

