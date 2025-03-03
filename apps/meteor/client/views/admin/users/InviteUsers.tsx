import {
	Box,
	Button,
	ButtonGroup,
	Icon,
	States,
	StatesAction,
	StatesActions,
	StatesSubtitle,
	StatesTitle,
	TextAreaInput,
} from '@rocket.chat/fuselage';
import { useTranslation, useRoute } from '@rocket.chat/ui-contexts';
import type { ReactElement, ChangeEvent, ComponentProps } from 'react';
import React, { useCallback, useState } from 'react';

import { validateEmail } from '../../../../lib/emailValidator';
import { ContextualbarScrollableContent, ContextualbarFooter } from '../../../components/Contextualbar';
import { useSendInvitationEmailMutation } from './hooks/useSendInvitationEmailMutation';
import { useSmtpConfig } from './hooks/useSmtpConfig';

type InviteUsersProps = ComponentProps<typeof ContextualbarScrollableContent>;

const InviteUsers = (props: InviteUsersProps): ReactElement => {
	const t = useTranslation();
	const [text, setText] = useState('');
	const getEmails = useCallback((text) => text.split(/[\ ,;]+/i).filter((val: string) => validateEmail(val)), []);
	const adminRouter = useRoute('admin-settings');
	const sendInvitationMutation = useSendInvitationEmailMutation();
	const isSmtpEnabled = useSmtpConfig();

	const handleClick = () => {
		sendInvitationMutation.mutate({ emails: getEmails(text) });
	};

	if (!isSmtpEnabled) {
		return (
			<ContextualbarScrollableContent {...props} color='default'>
				<States>
					<StatesTitle>{t('SMTP_Server_Not_Setup_Title')}</StatesTitle>
					<StatesSubtitle>{t('SMTP_Server_Not_Setup_Description')}</StatesSubtitle>
					<StatesActions>
						<StatesAction role='link' onClick={() => adminRouter.push({ group: 'Email' })}>
							{t('Setup_SMTP')}
						</StatesAction>
					</StatesActions>
				</States>
			</ContextualbarScrollableContent>
		);
	}

	return (
		<>
			<ContextualbarScrollableContent {...props} color='default'>
				<Box is='h2' fontScale='h2' mb='x8'>
					{t('Send_invitation_email')}
				</Box>
				<Box fontScale='p2' mb='x8'>
					{t('Send_invitation_email_info')}
				</Box>
				<TextAreaInput rows={5} flexGrow={0} onChange={(e: ChangeEvent<HTMLInputElement>): void => setText(e.currentTarget.value)} />
			</ContextualbarScrollableContent>
			<ContextualbarFooter>
				<ButtonGroup stretch>
					<Button primary onClick={handleClick} disabled={!getEmails(text).length} alignItems='stretch' mb='x8'>
						<Icon name='send' size='x16' /> {t('Send')}
					</Button>
				</ButtonGroup>
			</ContextualbarFooter>
		</>
	);
};

export default InviteUsers;
