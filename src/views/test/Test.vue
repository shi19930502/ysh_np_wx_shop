<template>
	<div id="app">
		<!--<h1>Shopping Cart Example</h1>-->
		<!--<hr>
    <h2>Products</h2>
    <ProductList/>
    <hr>
    <ShoppingCart/>-->
		<dateTime v-model="result" :endTime="endTime"/>
	</div>
</template>

<script>
	import ProductList from './ProductList.vue'
	import ShoppingCart from './ShoppingCart.vue'
	import dateTime from '../component/dateTime.vue'
	export default {
		components: {
			ProductList,
			ShoppingCart,
			dateTime
		},
		data() {
			return {
				result: '2018-06-16 00:00~01:00',
				endTime: 12
			}
		}
	}
</script>