import { inject, Service } from '@angular/core'
import { NgdPreparedComponent, NgdTabs } from '../../docs.model'
import { NgdMetadataService } from './metadata.service'

@Service()
export class NgdTabbedService {
    private readonly metadataService = inject(NgdMetadataService)

    determineTabs(tabs: { source: NgdPreparedComponent[] }): NgdTabs {
        return {
            overview: this.hasOverview(tabs),
            api: this.hasAPI(tabs),
            theme: this.hasTheme(tabs),
            examples: this.hasExample(tabs)
        }
    }

    hasOverview(tabs: { source: NgdPreparedComponent[] }): boolean {
        return tabs.source.some((source) => this.componentHasOverview(source))
    }

    hasExample(tabs: { source: NgdPreparedComponent[] }): boolean {
        return tabs.source.some((source) => this.componentHasExamples(source))
    }

    hasTheme(tabs: { source: NgdPreparedComponent[] }): boolean {
        return tabs.source.some((source) => this.componentHasTheme(source))
    }

    hasAPI(tabs: { source: NgdPreparedComponent[] }): boolean {
        return tabs.source.some((source) => this.componentHasMethods(source) || this.componentHasProps(source))
    }

    componentHasTheme(component: NgdPreparedComponent): boolean {
        return component.styles &&
            component.styles.length > 0
    }

    componentHasProps(component: NgdPreparedComponent): boolean {
        return component &&
            component.props &&
            component.props.filter((m) => this.metadataService.isPublic(m)).length > 0
    }

    componentHasMethods(component: NgdPreparedComponent): boolean {
        return component &&
            component.methods &&
            component.methods.length > 0 &&
            component.methods
                .filter((m) => this.metadataService.isPublic(m))
                .some((method) => method.shortDescription || method.description)
    }

    componentHasOverview(component: NgdPreparedComponent): boolean {
        return component && component.overview && component.overview.length > 0
    }

    componentHasExamples(component: NgdPreparedComponent): boolean {
        return component.liveExamples && component.liveExamples.length > 0
    }
}
