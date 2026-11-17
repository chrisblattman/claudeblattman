# Synthetic teaching example for the data-analysis walkthrough.
# Run from the repository root:
#   Rscript docs/assets/data-analysis/payment-window-example.R
# Requires ggplot2 and svglite. All amounts are invented; no research data are loaded.

library(ggplot2)
library(grid)

set.seed(17)
plot_data <- data.frame(
  amount = c(exp(rnorm(300, mean = log(100), sd = 0.7)), 12000, 30000)
)
stopifnot(all(is.finite(plot_data$amount)), all(plot_data$amount > 0))

p_full <- ggplot(plot_data, aes(x = amount)) +
  geom_density(n = 4096, fill = "#c5dfda", color = "#28675f", linewidth = 0.7) +
  scale_x_continuous(labels = function(x) format(x, big.mark = ",", trim = TRUE)) +
  labs(x = "Recorded payment (invented units)", y = "Density") +
  theme_minimal(base_size = 11) +
  theme(
    panel.grid.minor = element_blank(),
    panel.grid.major.x = element_blank(),
    plot.title = element_text(face = "bold", size = 13),
    plot.subtitle = element_text(size = 10, margin = margin(b = 12)),
    plot.margin = margin(12, 14, 10, 12)
  )

bounds <- quantile(plot_data$amount, c(0.05, 0.95), na.rm = TRUE)
p_central <- p_full + coord_cartesian(xlim = unname(bounds))

# A view change must not change the data used for the density estimate.
full_layer <- ggplot_build(p_full)$data[[1]]
central_layer <- ggplot_build(p_central)$data[[1]]
stopifnot(identical(full_layer$x, central_layer$x))
stopifnot(identical(full_layer$density, central_layer$density))

n_visible <- sum(plot_data$amount >= bounds[1] & plot_data$amount <= bounds[2])
p_full <- p_full + labs(title = "Full range", subtitle = "Two large values stretch the horizontal axis")
p_central <- p_central + labs(
  title = "Same curve, central window",
  subtitle = sprintf("Pooled 5th–95th percentiles: %.0f–%.0f; %d of %d values in view",
                     bounds[1], bounds[2], n_visible, nrow(plot_data))
)

output <- "docs/images/data-analysis-payment-window.svg"
svglite::svglite(output, width = 11, height = 4.5, bg = "white")
grid.newpage()
pushViewport(viewport(layout = grid.layout(2, 2, heights = unit(c(0.92, 0.08), "npc"))))
print(p_full, vp = viewport(layout.pos.row = 1, layout.pos.col = 1))
print(p_central, vp = viewport(layout.pos.row = 1, layout.pos.col = 2))
grid.text(
  sprintf("Synthetic example. Both panels estimate the density using all %d observations; only the displayed x-range changes.", nrow(plot_data)),
  vp = viewport(layout.pos.row = 2, layout.pos.col = 1:2),
  gp = gpar(fontsize = 10, col = "#444444")
)
dev.off()
stopifnot(file.exists(output), file.info(output)$size > 0)
cat(sprintf("Wrote %s; %d/%d observations in window. Density estimates unchanged.\n",
            output, n_visible, nrow(plot_data)))
