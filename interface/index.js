const base='http://47.96.253.222:3000/api';
// const base='http://localhost:3000/api';
const URL={
	getThumbsTotal:base+'/getThumbsTotal',
	getCommentsTotal:base+'/getCommentsTotal',
	thumbsApp:base+'/thumbsApp',
	platformLogin:base+'/platformLogin',
	setComment:base+'/setComment',
	replySomeone:base+'/replySomeone',
	comments_lists:base+'/comments_lists',
	thumbsComment:base+'/thumbsComment'
	
}
export function get(url){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:url,
			success:(res)=>{
				resolve(res.data)
			},
			error:(err)=>{
				reject(err)
			}
		})
	})
}
export function post(url,params){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:url,
			data: params,
			header: {
				'content-type': 'application/json'
			},
			method: 'POST',
			success:(res)=>{
				resolve(res.data)
			},
			error:(err)=>{
				reject(err)
			}
		})
	})
}
export default URL;