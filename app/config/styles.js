import { COLORS } from "../constant";

export default {
    text: {
        color: COLORS.titleColor,
        fontWeight: '500',
        opacity: 0.7,
        letterSpacing: 1.2,
        fontSize: 14,
        padding: 5,
        textAlign: 'center',
    },
    shadowEffect: {
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    }
}