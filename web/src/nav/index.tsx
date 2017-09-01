import BookClosed from '@sourcegraph/icons/lib/BookClosed';
import List from '@sourcegraph/icons/lib/List';
import Share from '@sourcegraph/icons/lib/Share';
import * as copy from 'copy-to-clipboard';
import * as H from 'history';
import * as React from 'react';
import * as GitHub from 'react-icons/lib/go/mark-github';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { RepoBreadcrumb } from 'sourcegraph/components/Breadcrumb';
import { SearchBox } from 'sourcegraph/search/SearchBox';
import { events } from 'sourcegraph/tracking/events';
import * as url from 'sourcegraph/util/url';
import * as URI from 'urijs';

export class Navbar extends React.Component<RouteComponentProps<string[]>, {}> {
    public render(): JSX.Element | null {
        return <div className='navbar'>
            <div className='contents'>
                <Link to='/'>
                    <img className='spin' src='/.assets/img/sourcegraph-mark.svg' width='24' />
                </Link>
                {this.props.location.pathname !== '/' && <div id='search-box-container'><SearchBox /></div>}
                <span className='fill' />
                {this.props.location.pathname !== '/' && <a href='' target='_blank' className='open-on-desktop'>
                    <span>Open on desktop</span>
                    <svg className='icon' width='11px' height='9px'>
                        {/* tslint:disable-next-line */}
                        <path fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" id="path10_fill" d="M 6.325 8.4C 6.125 8.575 5.8 8.55 5.625 8.325C 5.55 8.25 5.5 8.125 5.5 8L 5.5 6C 2.95 6 1.4 6.875 0.825 8.7C 0.775 8.875 0.6 9 0.425 9C 0.2 9 -4.44089e-16 8.8 -4.44089e-16 8.575C -4.44089e-16 8.575 -4.44089e-16 8.575 -4.44089e-16 8.55C 0.125 4.825 1.925 2.675 5.5 2.5L 5.5 0.5C 5.5 0.225 5.725 8.88178e-16 6 8.88178e-16C 6.125 8.88178e-16 6.225 0.05 6.325 0.125L 10.825 3.875C 11.025 4.05 11.075 4.375 10.9 4.575C 10.875 4.6 10.85 4.625 10.825 4.65L 6.325 8.4Z" />
                    </svg>
                </a>}
            </div>
        </div>;
    }
}

interface RepoSubnavProps {
    uri: string;
    rev?: string;
    path?: string;
    onClickNavigation: () => void;
    location: H.Location;
}

interface RepoSubnavState {
    copiedLink?: boolean;
}

export class RepoSubnav extends React.Component<RepoSubnavProps, RepoSubnavState> {
    public state: RepoSubnavState = {};

    public render(): JSX.Element | null {
        const hash = url.parseHash(this.props.location.hash);
        return <div className='repo-subnav'>
            <span className='explorer' onClick={this.props.onClickNavigation}>
                <List />
                Navigation
            </span>
            <span className='path'>
                <BookClosed />
                <RepoBreadcrumb {...this.props} />
            </span>
            <span className='fill' />
            <span className='share' onClick={() => {
                events.ShareButtonClicked.log();

                const shareLink = URI.parse(window.location.href); // TODO(john): use this.props.location
                shareLink.query = (shareLink.query ? `${shareLink.query}&` : '') + 'utm_source=share';
                copy(URI.build(shareLink));
                this.setState({ copiedLink: true });

                setTimeout(() => {
                    this.setState({ copiedLink: undefined });
                }, 3000);
            }}>
                {this.state.copiedLink ? 'Copied link to clipboard!' : 'Share'}
                <Share />
            </span>
            {this.props.path && this.props.uri.split('/')[0] === 'github.com' &&
                <a href={url.toGitHubBlob({ uri: this.props.uri, rev: this.props.rev || 'master', path: this.props.path, line: hash.line })} className='view-external'>
                    View on GitHub
                <GitHub className='github-icon' /* TODO(john): use icon library */ />
                </a>}
        </div>;
    }
}
