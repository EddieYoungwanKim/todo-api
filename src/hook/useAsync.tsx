import { useReducer, useEffect, useCallback } from "react";

// type DataType = {
//   id: number,
//   title: string
// }

type StateType = {
  isLoading: boolean,
  data: any,
  error: object | null
}

type ActionType = { type: 'LOADING'} | { type: 'SUCCESS', data: any } | { type: 'ERROR', error:object }

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'LOADING' :
      return {
        ...state,
        isLoading: true,
        data: null,
        error: null
      }
    case 'SUCCESS' :
      return {
        ...state,
        isLoading: false,
        data: action.data,
        error: null
      }
    case 'ERROR' :
      return {
        ...state,
        isLoading: false,
        data: null,
        error: action.error
      }
    default:
      throw new Error(`unhandled action type ${action}`)
  }
}

function useAsync(callback: any, deps:any[] = [], skip = false):[StateType, () => void] {
  const initialState: StateType = {
    isLoading: false,
    data: null,
    error: null
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchData = useCallback(async() => {
    dispatch({type: 'LOADING'})
    try {
      const data = await callback()
      dispatch({type: 'SUCCESS', data})
    } catch(e) {
      dispatch({type: 'ERROR', error: e})
    }
  }, [callback])

  useEffect(() => {
    if (skip) return
    fetchData()
    // eslint-disable-next-line
  }, deps)

  return [state, fetchData] // state: 상태 값, fetchData: 특정요청을 다시 할수있는 함수
}

export default useAsync