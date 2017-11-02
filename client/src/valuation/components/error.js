export default {
  bindings: { error: '<', trans: '<' },
  template: '<h1>error ( {{ $ctrl.trans.from }} -> {{$ctrl.trans.to }}):</h1> <pre> {{ $ctrl.error.data }}</pre>'
}
