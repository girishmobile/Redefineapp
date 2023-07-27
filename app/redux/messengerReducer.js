export const initialState = {
    selectedId: 0,
    message: 'Hello'
};
export function messengerReducer(state, action) {
    switch (action.type) {
        case 'changed_selection': {
            return {
                ...state,
                selectedId: action.contactId,
                message: ''
            };
        }
        case 'edit_message': {
            return {
                ...state,
                message: action.message
            };
        }
        default: {

        }
    }
}
