import * as fromStyleGuide from '../actions/style-guide.actions';


export interface StyleGuideState {
  styleGuideFormData: object;
  styleGuideMessages: object;
  isFormValid: boolean;
}

export const initialState: StyleGuideState = {
  styleGuideFormData: {},
  styleGuideMessages: {},
  isFormValid: true
};

export function reducer(
  state = initialState,
  action: fromStyleGuide.StyleGuideActions
): StyleGuideState {
  switch (action.type) {
    case fromStyleGuide.UPDATE_ERROR_MESSAGES: {
      const formErrorMessagesPayload = action.payload.errorMessages;
      const formErrorIsInvalid = action.payload.isInvalid;

      const formErrorMessages = Object.keys(formErrorIsInvalid).reduce((acc, key) => {

        const objArr = (k: any): any[] => {
          return formErrorIsInvalid[k].map((item: any, i: any) => {
              return item ? formErrorMessagesPayload[k][i] : '';
          });
        };

        const isInvalid = objArr(key).filter(item => item.length);

       (acc as any)[key] = {
          messages: objArr(key),
          isInvalid: !!isInvalid.length
        };

        return acc;

        }, {});
      const isFormValid = !Object.keys(formErrorMessages)
        .filter(key => (formErrorMessages as any)[key].isInvalid).length;

      return {
        ...state,
        styleGuideMessages: formErrorMessages,
        isFormValid
      };
    }

  }

  return state;
}

export const getInviteUserData = (state: StyleGuideState) => state.styleGuideFormData;
export const getInviteUserErrorMessage = (state: StyleGuideState) => state.styleGuideMessages;
export const getStyleGuideIsFormValid = (state: StyleGuideState) => state.isFormValid;

