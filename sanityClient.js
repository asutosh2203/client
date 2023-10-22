import sanityClient  from '@sanity/client';
import imageUrlBuilder from "@sanity/image-url"

export const client = sanityClient(
    {
        projectId: "37yduzme",
        dataset: "production",
        apiVersion: "2022-03-13",
        useCdn: true,
        token: "skSJTNqUztWksbaQUzZ6hcia9cEdBt5875fYJRvkNE04FHrTp06gAdjaqel86OWaBypugi885PhxmlsarvWQjG1gHFnyhI9dLfg1XqIQ8UHYnWtCLvY3GGo6IR9aD0yAn8Q8ceokKzxHBLoUkO8NvZjaPTAc0Sb4AeC3TAhponQSwd1djCST"
    }
)

export const urlFor = (source) => imageUrlBuilder(client).image(source)