<template>
	<div>
		<div @click.stop="open" class="yd-datetime-input">
			<template v-if="!!value">{{value}}</template>
			<template v-else><span class="yd-datetime-placeholder">{{placeholder}}</span></template>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import mixin from '../../utils/mixin.js'
	import PickerComponent from './datePicker.vue';
	export default {
		name: 'yd-datetime',
		data() {
			return {
				picker: null,
				currentValue: this.value,
				tmpNum: 0
			}
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			placeholder: String,
			startTime: {
				default: 0
			},
			endTime: {
				default: 24
			},
			period: {
				default: 5
			},
			isTody: {
				default: 0
			},
		},
		methods: {
			open() {
				this.picker.open();
			},
			close() {
				this.picker.close();
			},
			removeElement() {
				if(this.picker && this.picker.$el) document.body.removeChild(this.picker.$el);
			},
			render() {
				this.removeElement();
				const Picker = Vue.extend(PickerComponent);
				const props = this._props;
				this.picker = new Picker({
					el: document.createElement('div'),
					data: props
				});
				document.body.appendChild(this.picker.$el);
				this.picker.$on('pickerConfirm', (value) => {
					this.currentValue = value;
					this.$emit('input', value);
					this.callback && this.callback(value);
				});
			}
		},
		mounted() {
			this.render();
		},
		beforeDestroy() {
			this.removeElement();
		}
	}
</script>
<style lang="scss">

</style>