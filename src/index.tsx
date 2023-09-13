import { QuarkElement, property, customElement, state } from "quarkc"
import {getClassNames} from './utils';
import style from "./index.less?inline"

type LoadingType = 'spinner' | 'circle' | 'wave' | 'cube' | 'rect' | 'disappear'
type LoadingSize = 'normal' | 'mini' | 'small' | 'large'

declare global {
  interface HTMLElementTagNameMap {
    "quark-ui-loading": QuarkUiLoading;
  }
}

const SpinnerIcon: QuarkElement[] = Array(12)
  .fill(null)
  .map((_, index) => <i class={`qk-loading__line qk-loading__line--${index+1}`} />);

const CircleIcon = (
  <svg class={'qk-loading__circle'} viewBox="25 25 50 50">
    <circle cx="50" cy="50" r="20" fill="none" />
  </svg>
);

@customElement({ tag: "quark-ui-loading", style })
class QuarkUiLoading extends QuarkElement {
  /** 存在slot时，是否展示loading */
  @property({ type: Boolean })
  loading = true
  @property()
  type: LoadingType = 'circle'
  @property({ type: String })
  size: LoadingSize = 'normal'

  // 是否有默认插槽
  @state() hasDefaultSlot: boolean = false
  // 是否展示loading
  @state() showLoadingFlag: boolean = false
  /** 
   * 处理是否展示loading
   * 1. 存在默认插槽时，根据props传入的loading决定是否加载loading
   * 2. 不存在默认插槽时，默认加载laoding
   */
  private handleShowLoadingFlag() {
    if (!this.hasDefaultSlot) {
      this.showLoadingFlag = true
    }
    this.showLoadingFlag = this.loading
  }
  private loadingConfig = {
    waves: 5,
  }

  componentDidMount() {
    this.hasDefaultSlot = this.children.length > 0
    this.handleShowLoadingFlag();
    console.log("dom loaded!", this.children.length, this.hasDefaultSlot,  this.showLoadingFlag)
  }

  render() {
    
    return (
      <div class='qk-loading'>
        {this.hasDefaultSlot && <div class={`qk-loading__content ${getClassNames({
          'qk-loading__content--active': this.loading
        })}`} id='qk'>
          <slot></slot>
          {this.loading && <div class='qk-loading__content__mask'></div>}
        </div>}

        {this.showLoadingFlag && <div class={`'qk-loading__box' ${getClassNames({
          'qk-loading__box--inside': this.hasDefaultSlot
        })}`}>
          <div class={`qk-loading__spinner qk-loading__spinner--${this.type}`}>
            <span class={`qk-loading__spinner--inner`}>{this.type === 'spinner' ? SpinnerIcon : CircleIcon}</span>
          </div>

          {Object.keys(this.loadingConfig).map((item) => (
            <div class={`qk-laoding__${item}`}>
              {Array(this.loadingConfig[item]).fill(null).map((_, index) => (
                <div class={`qk-loading__${item}__item qk-loading__${item}__item--${index+1}`}></div>
              ))}
            </div>
          ))}
        </div>}
      </div>
    );
  }
}

